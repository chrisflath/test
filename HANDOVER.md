# ChessBase Clone - Handover Document

## Project Overview

A modern, open-source, browser-based alternative to ChessBase, designed for an ~8-year-old chess player (~1150 DWZ / ~1500 FIDE). Built to be iPad-friendly, German-first, with gamification and pedagogical features beyond typical chess apps.

**Live dev:** `npm run dev` (runs on localhost:5173)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Board UI | `chessground` (custom React hook) |
| Chess Logic | `@jackstenglein/chess` (variation trees, comments, NAGs) |
| State | Zustand (persisted where needed) |
| Styling | Tailwind CSS 4 |
| i18n | Custom Zustand store (German default) |

## What's Built (Phases 1, 3, 4, 8)

### Phase 1: Board + PGN Viewer
- Interactive chessground board with legal move enforcement
- PGN notation panel with click-to-navigate, variations, comments, NAGs
- Keyboard navigation (arrow keys, Home/End)
- Board controls (start/back/forward/end/flip)
- Game headers display
- Sample PGN: Fischer vs Spassky 1972 Game 6

### Phase 3: Opening Explorer
- Lichess Masters + Lichess database integration
- Move statistics table (games, win/draw/loss %)
- **Middlegame plans** tab (unique feature - not just dry stats)
- **Famous games** panel as learning hooks
- FEN-keyed caching + debounce

### Phase 4: Engine Analysis
- Lichess Cloud Evaluation API (no client-side WASM needed, iPad-friendly)
- Multi-PV display with UCI-to-SAN conversion
- Vertical eval bar with sigmoid mapping
- Toggle on/off, depth display, cloud hit indicator
- Auto-evaluate on position change (200ms debounce)

### Phase 8: Training Features

**Strategic Training** (`/pages/TrainingPage.tsx`):
- 9 question types: weak squares, who is better, find the plan, worst piece, best move, pawn structure, piece placement, attack/defend, exchange decision
- 8 curated positions from famous games
- Interactive board square selection for some question types
- Multiple choice, side selection answer formats
- Session scoring with achievement integration

**Position Evaluation Trainer** (`/pages/EvalTrainerPage.tsx`):
- 6 weighted evaluation factors: Material(3), Development(2), King Safety(3), Pawn Structure(2), Space(1), Piece Activity(2)
- Score each factor -3 to +3 with German labels
- Balance meter visualization
- Comparison feedback showing your scores vs expert assessment
- 5 curated positions with per-factor explanations

### Gamification System
- 30+ achievements across 7 categories
- 8-level XP system (Anfaenger -> Legende)
- Daily streak tracking
- Trophy case with player card, stats, category filters
- Toast notifications on achievement unlock
- XP badge in toolbar

### i18n
- German (default) and English
- Toggle in toolbar
- All UI text, achievement names, training content bilingual

## Project Structure

```
src/
├── main.tsx / App.tsx          # Entry, 4-tab navigation
├── i18n.ts                     # German/English translations
├── types/chess.ts              # Shared types
├── stores/
│   ├── gameStore.ts            # Central game state (@jackstenglein/chess)
│   ├── engineStore.ts          # Cloud eval toggle, auto-evaluate
│   ├── trainingStore.ts        # Training session management
│   └── achievementStore.ts     # XP, streaks, stats, unlocks (persisted)
├── hooks/
│   ├── useChessground.ts       # Imperative bridge to chessground
│   └── useOpeningExplorer.ts   # Lichess API with caching
├── services/
│   ├── lichessApi.ts           # Opening explorer API
│   └── lichessEval.ts          # Cloud evaluation API
├── data/
│   ├── achievements.ts         # Achievement definitions, XP levels
│   ├── trainingPositions.ts    # Strategic training positions
│   └── evalScale.ts            # Evaluation factor definitions + positions
├── components/
│   ├── board/                  # ChessBoard, BoardControls
│   ├── notation/               # MoveList, MoveNode
│   ├── engine/                 # EnginePanel, EvalBar
│   ├── explorer/               # OpeningExplorer, MoveTable, PlanPanel, FamousGamesPanel
│   ├── headers/                # GameHeaders
│   ├── achievements/           # TrophyCase, AchievementToast, XpBadge
│   └── layout/                 # Toolbar
├── pages/
│   ├── AnalysisPage.tsx        # Main analysis view
│   ├── TrainingPage.tsx        # Strategic training
│   └── EvalTrainerPage.tsx     # Position evaluation trainer
└── db/                         # (Planned) Dexie.js IndexedDB schema
```

## Critical Implementation Details

### Chessground Board Sizing
Chessground requires explicit pixel dimensions. CSS `aspect-ratio` does NOT work. All boards must use:
```css
.board-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 aspect ratio */
}
.board-container .cg-wrap {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
```
JSX pattern:
```tsx
<div className="w-full max-w-[min(70vh,600px)]" style={{ minWidth: '320px' }}>
  <div ref={boardRef} className="board-container" />
</div>
```

### @jackstenglein/chess API
- `header.getRawValue('White')` for string access (NOT `header.tags.White` which returns typed objects)
- `chess.isCheck(move)` for check detection
- `chess.move(from, to)` returns Move or null
- Use `Square` type from `@jackstenglein/chess`, `Key` type from `chessground/types`

### Vite Config
COOP/COEP headers are set for future Stockfish WASM support. `stockfish` excluded from optimizeDeps.

## What's NOT Built Yet (Future Phases)

### Phase 2: Database (Import & Browse Games)
- Dexie.js IndexedDB schema
- Streaming PGN importer (chunked reader, batch inserts)
- Import dialog with file picker + progress
- Virtualized game list (@tanstack/react-virtual)
- Search filters (player, date, ECO, result)
- PGN export (clipboard + file download)

### Phase 5: Annotations
- Variation creation/editing in move list
- Comment editor (inline text)
- NAG toolbar (!, ?, !!, ??, !?, ?!)

### Phase 6: PDF Export
- Printable annotated game sheets (jsPDF or @react-pdf/renderer)
- Board diagrams at key positions
- Batch export from database

### Phase 7: Error Analysis & Clustering
- Batch-analyze player's games with engine
- Classify errors by type (tactical, positional, time, endgame)
- Cluster by opening/ECO, game phase, piece patterns
- Weakness heatmap dashboard
- Performance tracking over time

### Phase 9: Polish
- Board themes/piece sets
- Position search (FEN hash index)
- Drag-and-drop PGN
- PWA/offline mode
- Opening name display via ECO database
- Scoresheet OCR (son brings home handwritten A5 scoresheets)

## Known Issues / Recent Fixes

1. **Board rendering fix (just committed):** All three board components (ChessBoard, EvalTrainerPage StaticBoard, TrainingPage TrainingBoard) were updated to use the `board-container` CSS pattern instead of `aspect-square` which caused jumbled rendering.

2. **More curated content needed:** Currently 8 strategic training positions and 5 evaluation positions. Should be expanded significantly for real use.

3. **Opening Explorer plans/famous games:** Currently returns placeholder content. Would benefit from a real curated database of middlegame plans per opening and famous game recommendations.

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Branch

All work is on: `claude/chess-database-clone-COdn2`

## Plan File

Full architectural plan: `/root/.claude/plans/rosy-stirring-kahn.md`
