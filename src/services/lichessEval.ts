/**
 * Lichess Cloud Evaluation API.
 *
 * Uses Lichess's database of ~370M pre-analyzed positions.
 * Instant results for known positions, no client-side computation needed.
 * Works on any device including iPad.
 *
 * API docs: https://lichess.org/api#tag/Analysis
 */

export interface CloudEvalLine {
  /** Evaluation in centipawns (positive = white advantage) */
  cp?: number;
  /** Mate in N moves (positive = white mates, negative = black mates) */
  mate?: number;
  /** Principal variation as UCI move sequence */
  moves: string;
  /** Depth of analysis */
  depth: number;
}

export interface CloudEvalResult {
  fen: string;
  /** Depth of the deepest line */
  depth: number;
  /** Up to 5 best lines */
  lines: CloudEvalLine[];
  /** Knodes searched (thousands of nodes) */
  knodes?: number;
}

const EVAL_API = 'https://lichess.org/api/cloud-eval';

const cache = new Map<string, { data: CloudEvalResult; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes (evals don't change)

/**
 * Fetch cloud evaluation for a position.
 * Returns null if the position hasn't been analyzed yet.
 *
 * @param fen The FEN of the position to evaluate
 * @param multiPv Number of best lines to return (1-5)
 */
export async function fetchCloudEval(
  fen: string,
  multiPv: number = 3
): Promise<CloudEvalResult | null> {
  const cacheKey = `${fen}:${multiPv}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const params = new URLSearchParams({
    fen,
    multiPv: String(multiPv),
  });

  try {
    const response = await fetch(`${EVAL_API}?${params}`);

    if (response.status === 404) {
      // Position not in the cloud database
      return null;
    }

    if (!response.ok) {
      // Rate limited or server error -- fail silently
      return null;
    }

    const raw = await response.json();

    const result: CloudEvalResult = {
      fen,
      depth: raw.depth || 0,
      knodes: raw.knodes,
      lines: (raw.pvs || []).map(
        (pv: { cp?: number; mate?: number; moves: string; depth?: number }) => ({
          cp: pv.cp,
          mate: pv.mate,
          moves: pv.moves,
          depth: pv.depth || raw.depth || 0,
        })
      ),
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch {
    // Network error -- fail silently
    return null;
  }
}

/**
 * Format an evaluation score for display.
 * Returns a human-readable string like "+1.5", "-0.3", "M5", "M-3"
 */
export function formatEval(line: CloudEvalLine): string {
  if (line.mate !== undefined) {
    return line.mate > 0 ? `M${line.mate}` : `M${line.mate}`;
  }
  if (line.cp !== undefined) {
    const score = line.cp / 100;
    return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
  }
  return '?';
}

/**
 * Get the normalized evaluation as a number between 0 and 1
 * for the eval bar (0 = black winning, 1 = white winning).
 */
export function evalToBarPercent(line: CloudEvalLine | null): number {
  if (!line) return 50;
  if (line.mate !== undefined) {
    return line.mate > 0 ? 100 : 0;
  }
  if (line.cp !== undefined) {
    // Sigmoid-like mapping: ±500cp maps to ~95%
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.004 * line.cp)) - 1);
    return Math.max(1, Math.min(99, winChance));
  }
  return 50;
}

/**
 * Convert a UCI move string to SAN notation.
 * Simple heuristic: just returns UCI for now; proper conversion
 * needs a chess instance. We'll do that in the component.
 */
export function uciToReadable(uci: string): string {
  return uci;
}
