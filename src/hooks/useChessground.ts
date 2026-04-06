import { useEffect, useRef, useCallback } from 'react';
import { Chessground } from 'chessground';
import type { Api } from 'chessground/api';
import type { Config } from 'chessground/config';
import type { Key, Color } from 'chessground/types';

interface UseChessgroundProps {
  fen: string;
  orientation: Color;
  turnColor: Color;
  lastMove?: [Key, Key];
  movable?: {
    free?: boolean;
    dests?: Map<Key, Key[]>;
  };
  check?: boolean;
  onMove?: (from: Key, to: Key) => void;
}

export function useChessground(props: UseChessgroundProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const onMoveRef = useRef(props.onMove);
  onMoveRef.current = props.onMove;

  // Initialize chessground
  useEffect(() => {
    if (!boardRef.current) return;

    const config: Config = {
      fen: props.fen,
      orientation: props.orientation,
      turnColor: props.turnColor,
      check: props.check,
      lastMove: props.lastMove,
      movable: {
        free: false,
        color: 'both',
        dests: props.movable?.dests,
        showDests: true,
      },
      draggable: {
        enabled: true,
        showGhost: true,
      },
      highlight: {
        lastMove: true,
        check: true,
      },
      animation: {
        enabled: true,
        duration: 200,
      },
      events: {
        move: (orig: Key, dest: Key) => {
          onMoveRef.current?.(orig, dest);
        },
      },
    };

    apiRef.current = Chessground(boardRef.current, config);

    return () => {
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  // Only run on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update board state when props change
  useEffect(() => {
    if (!apiRef.current) return;

    apiRef.current.set({
      fen: props.fen,
      orientation: props.orientation,
      turnColor: props.turnColor,
      check: props.check,
      lastMove: props.lastMove,
      movable: {
        free: false,
        color: 'both',
        dests: props.movable?.dests,
        showDests: true,
      },
    });
  }, [props.fen, props.orientation, props.turnColor, props.check, props.lastMove, props.movable?.dests]);

  const getApi = useCallback(() => apiRef.current, []);

  return { boardRef, getApi };
}
