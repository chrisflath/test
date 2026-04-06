import type { ExplorerData, ExplorerMove, ExplorerGame } from '../types/chess';

const EXPLORER_BASE = 'https://explorer.lichess.ovh';

export type ExplorerDatabase = 'masters' | 'lichess';

interface RawExplorerResponse {
  white: number;
  draws: number;
  black: number;
  moves: Array<{
    uci: string;
    san: string;
    white: number;
    draws: number;
    black: number;
    averageRating: number;
  }>;
  topGames?: Array<{
    id: string;
    white: { name: string; rating: number };
    black: { name: string; rating: number };
    year: number;
    winner: 'white' | 'black' | null;
  }>;
  opening?: { eco: string; name: string };
}

const cache = new Map<string, { data: ExplorerData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchExplorerData(
  fen: string,
  database: ExplorerDatabase = 'masters'
): Promise<ExplorerData> {
  const cacheKey = `${database}:${fen}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const params = new URLSearchParams({ fen });

  if (database === 'lichess') {
    params.set('ratings', '1600,1800,2000,2200,2500');
    params.set('speeds', 'rapid,classical');
  }

  const url = `${EXPLORER_BASE}/${database}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Explorer API error: ${response.status}`);
  }

  const raw: RawExplorerResponse = await response.json();

  const data: ExplorerData = {
    white: raw.white,
    draws: raw.draws,
    black: raw.black,
    moves: raw.moves.map(
      (m): ExplorerMove => ({
        san: m.san,
        uci: m.uci,
        white: m.white,
        draws: m.draws,
        black: m.black,
        averageRating: m.averageRating,
      })
    ),
    topGames: (raw.topGames || []).map(
      (g): ExplorerGame => ({
        id: g.id,
        white: g.white,
        black: g.black,
        year: g.year,
        winner: g.winner,
      })
    ),
    opening: raw.opening,
  };

  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
