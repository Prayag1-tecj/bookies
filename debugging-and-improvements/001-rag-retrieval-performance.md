# Debugging RAG Retrieval Performance in Bookies

**Date:** October 24, 2026  
**Category:** Performance Investigation  
**Status:** Bottleneck identified; optimization in progress

## 1. Objective

Bookies is an AI-powered book mentor that uses Retrieval-Augmented Generation (RAG) to retrieve relevant passages from uploaded books and provide context for AI-generated answers.

The goal of this investigation was to benchmark the retrieval pipeline, identify performance bottlenecks, and determine where optimization would have the greatest impact.

## 2. Problem

The initial benchmark took approximately **657.6 seconds (10.96 minutes)** to retrieve relevant passages for one question while scanning 156 chunks.

This was unexpectedly slow for a relatively small retrieval workload.

## 3. Investigation

I instrumented the benchmark to measure three stages independently:

- **Query embedding:** Converting the question into a vector using `all-MiniLM-L6-v2`.
- **Database fetching:** Fetching stored chunk embeddings and related records through Django ORM.
- **Similarity scoring:** Calculating cosine similarity and ranking the most relevant chunks.

During this process, the benchmark also encountered a `KeyError` caused by a mismatch between the scoring-time dictionary key and the key used in the output statement. I corrected the reporting key and reran the benchmark.

## 4. Benchmark results

The subsequent single-question run produced these results:

| Metric | Result |
|---|---:|
| Total retrieval time | 29,489.5 ms |
| Query embedding | 29.7 ms |
| Database fetching | 29,400.4 ms |
| Similarity scoring and sorting | 59.3 ms |
| Chunks scanned | 156 |

Database fetching accounted for approximately **99.7% of the reported total retrieval time** in this run.

The initial run took approximately 10.96 minutes, while the subsequent run took approximately 29.49 seconds. The reason for this variation has not yet been established, so these results should not be treated as a controlled before-and-after optimization comparison.

## 5. Findings

The benchmark indicates that database fetching is the dominant bottleneck in the measured run.

Query embedding generation and similarity scoring were comparatively fast. This means that optimizing those stages first would be unlikely to address the main observed delay.

However, the timing does not yet establish the exact underlying cause of the database-fetch latency. Further investigation is needed to distinguish query execution time, connection latency, data transfer, and Django ORM deserialization.

## 6. Why benchmarking matters

Benchmarking establishes a measurable baseline before optimization. It helps engineers identify bottlenecks, prioritize changes, compare results under comparable conditions, and detect performance regressions.

Instead of guessing which part of the system is slow, I used timing instrumentation to determine where most of the time was being spent.

## 7. Next steps

1. Investigate database query and fetch latency separately.
2. Examine Django ORM behavior and JSON embedding retrieval.
3. Implement a targeted optimization based on the findings.
4. Rerun the benchmark under comparable conditions.
5. Evaluate retrieval quality using a larger labelled question set.

## Conclusion

This investigation narrowed a major RAG performance issue to the database-fetch stage. The bottleneck has been identified, but its exact underlying cause and the final optimization still need to be verified.

The main lesson: **measure first, optimize second, and verify the result.**
