"""Reproducible baseline benchmark for Bookies' existing RAG pipeline.

Run from backend/: python manage.py evaluate_rag --dataset ../evaluation/questions.json
Add --include-generation to call Gemini (may consume API quota/cost).
"""
import json
import math
import statistics
import time
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from apps.books.models import Book, ChunkEmbedding
from apps.books.services.embedding_service import generate_embedding
from apps.chat.services.gemini_service import generate_answer
from sklearn.metrics.pairwise import cosine_similarity


def percentile(values, p):
    if not values:
        return None
    values = sorted(values)
    if len(values) == 1:
        return round(values[0], 2)
    index = (len(values) - 1) * p
    lower = math.floor(index)
    upper = math.ceil(index)
    if lower == upper:
        return round(values[lower], 2)
    return round(values[lower] + (values[upper] - values[lower]) * (index - lower), 2)


def normalize(text):
    return " ".join((text or "").lower().split())


def passage_match(chunk_text, gold_passages):
    """A retrieved chunk is relevant if it contains a labelled gold passage.

    Use short, distinctive verbatim excerpts for gold_passages. This simple
    matching rule is transparent and reproducible; it is not semantic judging.
    """
    chunk = normalize(chunk_text)
    return any(normalize(passage) and normalize(passage) in chunk for passage in gold_passages)


class Command(BaseCommand):
    help = "Benchmark Bookies retrieval latency and optionally Gemini answer latency."

    def add_arguments(self, parser):
        parser.add_argument("--dataset", required=True, help="Path to evaluation/questions.json")
        parser.add_argument("--output", default="evaluation/baseline-results.json")
        parser.add_argument("--top-k", type=int, default=5)
        parser.add_argument("--include-generation", action="store_true", help="Call Gemini; this may consume API quota/cost")

    def handle(self, *args, **opts):
        dataset_path = Path(opts["dataset"]).resolve()
        if not dataset_path.exists():
            raise CommandError(f"Dataset not found: {dataset_path}")
        try:
            dataset = json.loads(dataset_path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise CommandError(f"Could not parse dataset JSON: {exc}")
        if not isinstance(dataset, list) or not dataset:
            raise CommandError("Dataset must be a non-empty JSON list of question objects.")
        top_k = max(1, opts["top_k"])
        rows = []
        reciprocal_ranks = []
        hit_values = []

        for index, item in enumerate(dataset, start=1):
            question = str(item.get("question", "")).strip()
            if not question:
                raise CommandError(f"Dataset item {index} has no question.")
            book_id = item.get("book_id")
            book_title = item.get("book_title")
            if book_id is not None:
                book = Book.objects.filter(id=book_id).first()
            elif book_title:
                book = Book.objects.filter(title=book_title).first()
            else:
                raise CommandError(f"Dataset item {index} needs book_id or book_title.")
            if not book:
                raise CommandError(f"Could not find book for dataset item {index}: id={book_id}, title={book_title!r}")

            total_start = time.perf_counter()
            embed_start = time.perf_counter()
            query_vector = generate_embedding(question)
            embedding_ms = (time.perf_counter() - embed_start) * 1000

            db_start = time.perf_counter()
            embeddings = list(
                ChunkEmbedding.objects.select_related("chunk", "chunk__document", "chunk__document__book")
                .filter(chunk__document__book_id=book.id)
            )
            db_fetch_ms = (time.perf_counter() - db_start) * 1000

            score_start = time.perf_counter()
            scored = []
            for entry in embeddings:
                score = float(cosine_similarity([query_vector], [entry.embedding])[0][0])
                scored.append((score, entry.chunk))
            scored.sort(key=lambda pair: pair[0], reverse=True)
            ranked_chunks = [chunk for _, chunk in scored[:top_k]]
            scoring_ms = (time.perf_counter() - score_start) * 1000
            retrieval_ms = (time.perf_counter() - total_start) * 1000

            gold_passages = item.get("relevant_passages", [])
            first_relevant_rank = None
            if gold_passages:
                for rank, chunk in enumerate(ranked_chunks, start=1):
                    if passage_match(chunk.content, gold_passages):
                        first_relevant_rank = rank
                        break
                hit_values.append(1 if first_relevant_rank else 0)
                reciprocal_ranks.append(1 / first_relevant_rank if first_relevant_rank else 0)

            row = {
                "case_id": item.get("id", f"q{index:03d}"),
                "book_id": book.id,
                "book_title": book.title,
                "question": question,
                "chunk_count_scanned": len(embeddings),
                "embedding_ms": round(embedding_ms, 2),
                "database_fetch_ms": round(db_fetch_ms, 2),
                "scoring_and_sort_ms": round(scoring_ms, 2),
                "retrieval_total_ms": round(retrieval_ms, 2),
                "top_k": top_k,
                "first_relevant_rank": first_relevant_rank,
                "retrieval_hit": (first_relevant_rank is not None) if gold_passages else None,
                "top_chunks": [
                    {"chunk_index": chunk.chunk_index, "similarity": round(score, 4), "text_preview": chunk.content[:240]}
                    for score, chunk in scored[:top_k]
                ],
            }

            if opts["include_generation"]:
                generation_start = time.perf_counter()
                context = "\n\n".join(chunk.content for chunk in ranked_chunks)
                answer = generate_answer(question, context)
                generation_ms = (time.perf_counter() - generation_start) * 1000
                row["generation_ms"] = round(generation_ms, 2)
                row["end_to_end_ms"] = round(retrieval_ms + generation_ms, 2)
                row["answer"] = answer
            rows.append(row)
            
            self.stdout.write(
                f"{row['case_id']}: "
                f"total={row['retrieval_total_ms']:.1f} ms | "
                f"embedding={row['embedding_ms']:.1f} ms | "
                f"database={row['database_fetch_ms']:.1f} ms | "
                f"scoring={row['scoring_and_sort_ms']:.1f} ms | "
                f"chunks={row['chunk_count_scanned']}"
            )


        retrieval_times = [row["retrieval_total_ms"] for row in rows]
        summary = {
            "benchmark_name": "bookies-rag-baseline",
            "dataset_path": str(dataset_path),
            "question_count": len(rows),
            "top_k": top_k,
            "generation_included": bool(opts["include_generation"]),
            "metrics": {
                "retrieval_ms_mean": round(statistics.mean(retrieval_times), 2),
                "retrieval_ms_median": round(statistics.median(retrieval_times), 2),
                "retrieval_ms_p95": percentile(retrieval_times, 0.95),
                "retrieval_ms_min": round(min(retrieval_times), 2),
                "retrieval_ms_max": round(max(retrieval_times), 2),
                "chunks_scanned_mean": round(statistics.mean(row["chunk_count_scanned"] for row in rows), 2),
            },
            "notes": [
                "Timings are measured inside the Django process; they exclude browser, network, and HTTP middleware latency.",
                "The first run may differ due to OS/model/database caches. Use the same machine and repeat runs for comparisons.",
                "Retrieval quality metrics are computed only for cases with relevant_passages labels.",
                "Passage matching is exact normalized substring matching, not an LLM judge or semantic relevance classifier.",
            ],
            "results": rows,
        }
        if hit_values:
            summary["metrics"][f"hit_rate_at_{top_k}"] = round(sum(hit_values) / len(hit_values), 4)
            summary["metrics"][f"mrr_at_{top_k}"] = round(statistics.mean(reciprocal_ranks), 4)
            summary["metrics"]["labelled_question_count"] = len(hit_values)
        if opts["include_generation"]:
            end_to_end = [row["end_to_end_ms"] for row in rows]
            generations = [row["generation_ms"] for row in rows]
            summary["metrics"].update({
                "generation_ms_mean": round(statistics.mean(generations), 2),
                "generation_ms_median": round(statistics.median(generations), 2),
                "generation_ms_p95": percentile(generations, 0.95),
                "end_to_end_ms_mean": round(statistics.mean(end_to_end), 2),
                "end_to_end_ms_median": round(statistics.median(end_to_end), 2),
                "end_to_end_ms_p95": percentile(end_to_end, 0.95),
            })
        output_path = Path(opts["output"]).resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"\nSaved benchmark results to {output_path}"))
        self.stdout.write(json.dumps(summary["metrics"], indent=2))
