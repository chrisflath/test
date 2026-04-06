import { create } from 'zustand';
import { Chess } from '@jackstenglein/chess';
import type { Move } from '@jackstenglein/chess';
import type { Square } from '@jackstenglein/chess';
import type { Key } from 'chessground/types';

export interface GameState {
  chess: Chess;
  currentMove: Move | null;
  fen: string;
  orientation: 'white' | 'black';

  // Actions
  loadPgn: (pgn: string) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  seek: (move: Move | null) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goForward: () => void;
  goBack: () => void;
  flipBoard: () => void;
  reset: () => void;
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  currentMove: null,
  fen: START_FEN,
  orientation: 'white',

  loadPgn: (pgn: string) => {
    const chess = new Chess({ pgn });
    // Go to the start of the game
    const firstMove = chess.firstMove();
    chess.seek(null);
    set({
      chess,
      currentMove: null,
      fen: chess.setUpFen(),
    });
    // If there are moves, stay at start for user to navigate
    if (firstMove) {
      // Stay at start position
    }
  },

  makeMove: (from: string, to: string, promotion?: string) => {
    const { chess } = get();
    const move = chess.move({ from: from as Square, to: to as Square, promotion });
    if (move) {
      set({
        currentMove: move,
        fen: move.fen,
      });
      return true;
    }
    return false;
  },

  seek: (move: Move | null) => {
    const { chess } = get();
    chess.seek(move);
    set({
      currentMove: move,
      fen: move ? move.fen : chess.setUpFen(),
    });
  },

  goToStart: () => {
    const { chess } = get();
    chess.seek(null);
    set({
      currentMove: null,
      fen: chess.setUpFen(),
    });
  },

  goToEnd: () => {
    const { chess } = get();
    const lastMove = chess.lastMove();
    if (lastMove) {
      chess.seek(lastMove);
      set({
        currentMove: lastMove,
        fen: lastMove.fen,
      });
    }
  },

  goForward: () => {
    const { chess, currentMove } = get();
    let nextMove: Move | null;
    if (currentMove === null) {
      nextMove = chess.firstMove();
    } else {
      nextMove = chess.nextMove(currentMove);
    }
    if (nextMove) {
      chess.seek(nextMove);
      set({
        currentMove: nextMove,
        fen: nextMove.fen,
      });
    }
  },

  goBack: () => {
    const { chess, currentMove } = get();
    if (currentMove === null) return;
    const prevMove = chess.previousMove(currentMove);
    chess.seek(prevMove);
    set({
      currentMove: prevMove,
      fen: prevMove ? prevMove.fen : chess.setUpFen(),
    });
  },

  flipBoard: () => {
    set((state) => ({
      orientation: state.orientation === 'white' ? 'black' : 'white',
    }));
  },

  reset: () => {
    set({
      chess: new Chess(),
      currentMove: null,
      fen: START_FEN,
      orientation: 'white',
    });
  },
}));

/** Get legal move destinations for chessground from current position */
export function getLegalDests(chess: Chess, move: Move | null): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  const moves = chess.moves(undefined, move);
  for (const m of moves) {
    const from = m.from as Key;
    const to = m.to as Key;
    if (!dests.has(from)) {
      dests.set(from, []);
    }
    dests.get(from)!.push(to);
  }
  return dests;
}
