import { useEffect } from 'react';
import { ChessBoard } from '../components/board/ChessBoard';
import { BoardControls } from '../components/board/BoardControls';
import { MoveList } from '../components/notation/MoveList';
import { GameHeaders } from '../components/headers/GameHeaders';
import { OpeningExplorer } from '../components/explorer/OpeningExplorer';
import { useGameStore } from '../stores/gameStore';

/** Sample game to show on first load */
const SAMPLE_PGN = `[Event "Schachweltmeisterschaft"]
[Site "Reykjavik"]
[Date "1972.07.23"]
[Round "6"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1-0"]
[ECO "D59"]
[WhiteElo "2785"]
[BlackElo "2660"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6
8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3
Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6
fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5
26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7
32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6
38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`;

export function AnalysisPage() {
  const { loadPgn, goForward, goBack, goToStart, goToEnd } = useGameStore();

  // Load sample game on mount
  useEffect(() => {
    const { chess } = useGameStore.getState();
    if (chess.history().length === 0) {
      loadPgn(SAMPLE_PGN);
    }
  }, [loadPgn]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          goForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goBack();
          break;
        case 'Home':
          e.preventDefault();
          goToStart();
          break;
        case 'End':
          e.preventDefault();
          goToEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goForward, goBack, goToStart, goToEnd]);

  return (
    <div className="flex-1 p-2 md:p-4 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        {/* Left: Board */}
        <div className="flex-shrink-0 lg:w-[45%]">
          <ChessBoard />
          <BoardControls />
        </div>

        {/* Right: Info panels stacked */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <GameHeaders />

          {/* Moves panel */}
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
            <MoveList />
          </div>

          {/* Opening Explorer with plans & famous games */}
          <OpeningExplorer />
        </div>
      </div>
    </div>
  );
}
