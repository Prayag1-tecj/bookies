# Bookies RAG Baseline Benchmark

This is a baseline harness for the existing Django RAG implementation. It records embedding time, database fetch time, similarity-scoring/sorting time, retrieval total, number of stored chunks scanned, and (optionally) Gemini generation and end-to-end pipeline time. It can also calculate Hit Rate@K and MRR@K when you label relevant passages.

## 1. Prepare a fixed evaluation set

1. Run Bookies locally with its existing database and a book already uploaded and processed.
2. Copy `questions.template.json` to `questions.json`.
3. Set `book_title` to the exact title in your database (or use `book_id`).
4. Add 20–30 questions from that book. Include factual questions, questions requiring multiple passages, details that are easy to confuse, and questions whose answer is not in the book.
5. For each answerable question, add one or more short, distinctive, exact quotes in `relevant_passages`. These labels are used to compute retrieval Hit Rate@K and MRR@K. For unanswerable questions, use an empty array. Keep this exact dataset unchanged for later comparisons.
6. Add a `gold_answer` to each item for later manual answer evaluation; the current script does not automatically score answer correctness or groundedness.

Avoid using private or copyrighted content you do not have permission to test. Do not commit real user data or API keys.

## 2. Run retrieval-only benchmark

From the `backend` directory with the same environment used by Bookies:

```powershell
python manage.py evaluate_rag --dataset ../evaluation/questions.json --output ../evaluation/baseline-retrieval.json --top-k 5
```

This does not call Gemini. It measures embedding and retrieval work inside the Django process.

## 3. Run full RAG timing (Gemini calls)

```powershell
python manage.py evaluate_rag --dataset ../evaluation/questions.json --output ../evaluation/baseline-full.json --top-k 5 --include-generation
```

This sends one Gemini request per question and may consume API quota or incur cost. Use a small set first. Check your API quota before running.

## 4. Repeatability protocol

- Run the same dataset on the same machine, database, Python environment, and model version.
- Run once as a warm-up, then run at least three measured times; retain all output JSON files.
- Compare medians and p95, not only averages. Treat the first request separately if it is much slower.
- Record date, git commit, dataset version/hash, hardware, Python/dependency versions, database location, and whether generation was enabled.
- Don't compare local timings against cloud timings as if they were equivalent.

## Metrics

- `embedding_ms`: time to encode the question.
- `database_fetch_ms`: time to fetch all embeddings for the book.
- `scoring_and_sort_ms`: cosine similarity calculations and ranking.
- `retrieval_total_ms`: question embedding + DB fetch + scoring/ranking.
- `generation_ms`: Gemini generation only (only with `--include-generation`).
- `end_to_end_ms`: retrieval plus generation, inside the Django process (only with `--include-generation`). This excludes browser/network/middleware overhead.
- `hit_rate_at_k`: fraction of labelled questions where at least one retrieved top-k chunk contains a labelled passage.
- `mrr_at_k`: mean reciprocal rank of the first retrieved chunk containing a labelled passage.

Passage matching is transparent exact normalized substring matching, not a semantic evaluator. If the chunking strategy changes, review labels carefully so they still identify the same relevant source passage.
