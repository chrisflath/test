import { useGameStore } from '../../stores/gameStore';
import { useI18n } from '../../i18n';
import type { Move } from '@jackstenglein/chess';

/** Render NAG symbols as human-readable annotations */
function nagToSymbol(nag: string): string {
  const map: Record<string, string> = {
    '$1': '!', '$2': '?', '$3': '!!', '$4': '??',
    '$5': '!?', '$6': '?!', '$10': '=', '$13': '∞',
    '$14': '+=', '$15': '=+', '$16': '±', '$17': '∓',
    '$18': '+-', '$19': '-+', '$22': '⨀', '$32': '⟳',
    '$36': '→', '$40': '↑', '$132': '⇆', '$138': '⨁',
  };
  return map[nag] || nag;
}

function MoveNode({
  move,
  currentMove,
  onSeek,
  showMoveNumber,
}: {
  move: Move;
  currentMove: Move | null;
  onSeek: (move: Move | null) => void;
  showMoveNumber: boolean;
}) {
  const isActive = currentMove === move;
  const isWhiteMove = move.color === 'w';
  const moveNumber = Math.ceil(move.ply / 2);

  return (
    <span className="inline">
      {/* Move number */}
      {(isWhiteMove || showMoveNumber) && (
        <span className="text-[var(--color-text-muted)] mr-0.5 text-base">
          {moveNumber}{isWhiteMove ? '.' : '...'}
        </span>
      )}

      {/* Move SAN */}
      <span
        onClick={() => onSeek(move)}
        className={`cursor-pointer px-1 py-0.5 rounded text-lg font-medium
                   hover:bg-[var(--color-surface-2)] transition-colors
                   ${isActive
                     ? 'bg-[var(--color-accent)] text-white'
                     : 'text-[var(--color-text)]'
                   }`}
      >
        {move.san}
      </span>

      {/* NAGs */}
      {move.nags?.map((nag, i) => (
        <span key={i} className="text-yellow-400 text-base font-bold ml-0.5">
          {nagToSymbol(nag)}
        </span>
      ))}

      {/* Comment after move */}
      {move.commentAfter && (
        <span className="text-[var(--color-text-muted)] text-sm italic mx-1">
          {move.commentAfter}
        </span>
      )}

      {/* Render variations */}
      {move.variations.length > 0 && (
        <>
          {move.variations.map((variation, i) => (
            <span
              key={i}
              className="text-[var(--color-text-muted)] text-sm ml-1"
            >
              {'( '}
              <VariationLine
                moves={variation}
                currentMove={currentMove}
                onSeek={onSeek}
              />
              {' )'}
            </span>
          ))}
        </>
      )}

      <span> </span>
    </span>
  );
}

function VariationLine({
  moves,
  currentMove,
  onSeek,
}: {
  moves: Move[];
  currentMove: Move | null;
  onSeek: (move: Move | null) => void;
}) {
  return (
    <>
      {moves.map((move, index) => (
        <MoveNode
          key={`${move.ply}-${move.san}`}
          move={move}
          currentMove={currentMove}
          onSeek={onSeek}
          showMoveNumber={index === 0 || move.color === 'w'}
        />
      ))}
    </>
  );
}

export function MoveList() {
  const { chess, currentMove, seek } = useGameStore();
  const { t } = useI18n();
  const history = chess.history();

  if (history.length === 0) {
    return (
      <div className="p-4 text-[var(--color-text-muted)] text-lg text-center">
        {t('panel.moves')} — {t('action.load_pgn')}
      </div>
    );
  }

  return (
    <div className="p-3 overflow-y-auto max-h-[50vh] leading-relaxed">
      {/* Starting comment */}
      {chess.firstMove()?.commentMove && (
        <span className="text-[var(--color-text-muted)] text-sm italic block mb-2">
          {chess.firstMove()!.commentMove}
        </span>
      )}

      {/* Move list */}
      <div className="flex flex-wrap items-baseline gap-y-1">
        {history.map((move, index) => (
          <MoveNode
            key={`${move.ply}-${move.san}`}
            move={move}
            currentMove={currentMove}
            onSeek={seek}
            showMoveNumber={index === 0 || move.color === 'w'}
          />
        ))}
      </div>

      {/* Result */}
      {chess.header().tags.Result && (
        <div className="mt-3 text-center font-bold text-xl text-[var(--color-text)]">
          {chess.header().tags.Result}
        </div>
      )}
    </div>
  );
}
