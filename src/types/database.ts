export interface StoredGame {
  id?: number;
  white: string;
  black: string;
  whiteElo?: number;
  blackElo?: number;
  date?: string;
  event?: string;
  site?: string;
  round?: string;
  result: string;
  eco?: string;
  pgn: string;
  openingName?: string;
  plyCount?: number;
  importedAt: number;
  collectionId?: number;
}

export interface SearchFilters {
  white?: string;
  black?: string;
  dateFrom?: string;
  dateTo?: string;
  eco?: string;
  result?: string;
  event?: string;
}
