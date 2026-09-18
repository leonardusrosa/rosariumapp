# Bibliotheca Vision Recognition Benchmark Report

**Date & Time**: 2026-09-18T21:40:02.438Z
**Dataset Type**: Deterministic Smoke Dataset (CI/Synthetic)
**Total Test Runs**: 2

> [!NOTE]
> This report presents measured empirical results across candidate vision models without declaring an automated winner. Model selection remains an explicit product decision based on these tradeoffs.

## Single-Cover Recognition Leaderboard

| Model / Candidate | Serving Provider | Work Acc | Title Match | Author Match | ISBN Acc | High-Conf Errors | Latency (Avg/p95) | Cost (Est) | Reliability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mock Deterministic Vision Engine** | `mock-engine` | 100.0% | 100.0% | 100.0% | 100.0% | 0 | 145ms / 145ms | $0.00015 | 1/1 ok |

## Bookshelf Recognition Leaderboard

| Model / Candidate | Serving Provider | Precision | Recall | F1 Score | TP | FP | FN | High-Conf Errors | Latency (Avg/p95) | Reliability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mock Deterministic Vision Engine** | `mock-engine` | 100.0% | 100.0% | **100.0%** | 5 | 0 | 0 | 0 | 310ms / 310ms | 1/1 ok |

## Detailed Case Logs

### Case `smoke-cover-001` (cover)

- **mock/deterministic-vision** (Run 1): Work identified: YES | Title: 1 | Author: 1 | Latency: 145ms

### Case `smoke-shelf-001` (shelf)

- **mock/deterministic-vision** (Run 1): Precision: 1 | Recall: 1 | F1: 1 (TP: 5, FP: 0, FN: 0) | Latency: 310ms
