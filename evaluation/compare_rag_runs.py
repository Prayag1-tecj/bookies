"""Compare two evaluate_rag JSON outputs and report metric changes."""
import argparse
import json

LOWER_IS_BETTER = ("_ms_mean", "_ms_median", "_ms_p95", "_ms_min", "_ms_max")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("baseline")
    parser.add_argument("candidate")
    args = parser.parse_args()
    with open(args.baseline, encoding="utf-8") as f:
        baseline = json.load(f)
    with open(args.candidate, encoding="utf-8") as f:
        candidate = json.load(f)
    bm = baseline.get("metrics", {})
    cm = candidate.get("metrics", {})
    print(f"Baseline questions: {baseline.get('question_count')} | Candidate questions: {candidate.get('question_count')}")
    print("Metric | Baseline | Candidate | Change")
    print("---|---:|---:|---:")
    for key in bm.keys() & cm.keys():
        a, b = bm[key], cm[key]
        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            continue
        if a == 0:
            change = "n/a (baseline is zero)"
        else:
            pct = ((b - a) / abs(a)) * 100
            if key.endswith(LOWER_IS_BETTER):
                interpretation = "faster" if pct < 0 else "slower" if pct > 0 else "unchanged"
            else:
                interpretation = "increase" if pct > 0 else "decrease" if pct < 0 else "unchanged"
            change = f"{pct:+.2f}% ({interpretation})"
        print(f"{key} | {a} | {b} | {change}")
    print("\nFor Hit Rate@K and MRR@K, also compare absolute percentage-point change; relative percent alone can be misleading.")
    if baseline.get("top_k") != candidate.get("top_k"):
        print("WARNING: top_k differs between runs; retrieval quality results are not directly comparable.")
    if baseline.get("question_count") != candidate.get("question_count"):
        print("WARNING: question counts differ; use the same fixed dataset for valid comparison.")

if __name__ == "__main__":
    main()
