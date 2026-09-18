/**
 * Globally optimal maximum-weight bipartite matching (Kuhn-Munkres / Hungarian algorithm).
 * Guarantees optimal global assignment so duplicate or similar titles do not greedily distort scores.
 */

export interface BipartiteMatch {
  detectedIndex: number;
  expectedIndex: number;
  weight: number;
}

/**
 * Solves the maximum weight bipartite matching problem for an N x M weight matrix.
 * Rows = Detected items (0..N-1)
 * Columns = Expected items (0..M-1)
 */
export function maxWeightBipartiteMatching(weights: number[][]): BipartiteMatch[] {
  const n = weights.length;
  if (n === 0) return [];
  const m = weights[0].length;
  if (m === 0) return [];

  // Pad matrix to square K x K
  const k = Math.max(n, m);
  const cost: number[][] = Array.from({ length: k }, () => Array(k).fill(0));

  let maxW = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (weights[i][j] > maxW) maxW = weights[i][j];
    }
  }

  // Convert maximum weight to minimum cost
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      cost[i][j] = maxW - weights[i][j];
    }
  }
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      if (i >= n || j >= m) cost[i][j] = maxW;
    }
  }

  // Hungarian algorithm (O(K^3))
  const u = Array(k + 1).fill(0);
  const v = Array(k + 1).fill(0);
  const p = Array(k + 1).fill(0);
  const way = Array(k + 1).fill(0);

  for (let i = 1; i <= k; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = Array(k + 1).fill(Infinity);
    const used = Array(k + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;

      for (let j = 1; j <= k; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      for (let j = 0; j <= k; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0);

    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  // Extract matched pairs for real (non-padded) elements
  const matches: BipartiteMatch[] = [];
  for (let j = 1; j <= m; j++) {
    const i = p[j] - 1;
    if (i < n) {
      const w = weights[i][j - 1];
      if (w > 0) {
        matches.push({
          detectedIndex: i,
          expectedIndex: j - 1,
          weight: w,
        });
      }
    }
  }

  return matches;
}
