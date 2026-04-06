export interface GameHeaders {
  white: string;
  black: string;
  whiteElo?: string;
  blackElo?: string;
  date?: string;
  event?: string;
  site?: string;
  round?: string;
  result: string;
  eco?: string;
}

export interface EngineEvaluation {
  depth: number;
  score: number; // in centipawns, positive = white advantage
  mate?: number; // mate in N moves
  pv: string[]; // principal variation (best line)
  multipv: number; // which PV line (1-indexed)
  nps?: number;
}

export interface ExplorerMove {
  san: string;
  uci: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

export interface ExplorerData {
  white: number;
  draws: number;
  black: number;
  moves: ExplorerMove[];
  topGames: ExplorerGame[];
  opening?: { eco: string; name: string };
}

export interface ExplorerGame {
  id: string;
  white: { name: string; rating: number };
  black: { name: string; rating: number };
  year: number;
  winner: 'white' | 'black' | null;
}
