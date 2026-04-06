import { useMemo } from 'react';
import { useChessground } from '../../hooks/useChessground';
import { useGameStore, getLegalDests } from '../../stores/gameStore';
import type { Key, Color } from 'chessground/types';

export function ChessBoard() {
  const { chess, currentMove, fen, orientation, makeMove } = useGameStore();

  const turnColor: Color = fen.includes(' w ') ? 'white' : 'black';

  const lastMove = useMemo((): [Key, Key] | undefined => {
    if (!currentMove) return undefined;
    return [currentMove.from as Key, currentMove.to as Key];
  }, [currentMove]);

  const dests = useMemo(() => getLegalDests(chess, currentMove), [chess, currentMove]);

  const isCheck = useMemo(() => chess.isCheck(currentMove), [chess, currentMove]);

  const handleMove = (from: Key, to: Key) => {
    // Try the move -- if it needs promotion, default to queen
    const success = makeMove(from, to, 'q');
    if (!success) {
      // Try without promotion
      makeMove(from, to);
    }
  };

  const { boardRef } = useChessground({
    fen,
    orientation,
    turnColor,
    lastMove,
    check: isCheck,
    movable: { dests },
    onMove: handleMove,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[min(70vh,600px)]" style={{ minWidth: '320px' }}>
        <div ref={boardRef} className="board-container" />
      </div>
    </div>
  );
}
