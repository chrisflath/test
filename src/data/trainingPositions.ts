/**
 * Strategic Training System
 *
 * Unlike typical "guess the move" trainers, this asks questions a coach would ask:
 * - Which squares are weak?
 * - Who stands better and why?
 * - What's the plan for White/Black?
 * - Which piece is the worst?
 * - What's the pawn structure telling you?
 * - Where should this piece go?
 *
 * Each question type has its own interaction model:
 * - Square selection (tap squares on the board)
 * - Multiple choice (pick from options)
 * - Side selection (White/Black/Equal)
 * - Piece selection (tap a piece on the board)
 */

export type QuestionType =
  | 'weak_squares'       // Tap the weak squares in the position
  | 'who_is_better'      // White / Black / Equal + reason
  | 'find_the_plan'      // Multiple choice: what's the best plan?
  | 'worst_piece'        // Tap the piece that needs improvement
  | 'best_move'          // Classic guess-the-move but with explanation
  | 'pawn_structure'     // What type of pawn structure is this?
  | 'piece_placement'    // Where should this piece go? (tap target square)
  | 'attack_or_defend'   // Should you attack or defend here?
  | 'exchange_decision'; // Should you trade pieces here?

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingPosition {
  id: string;
  fen: string;
  /** Which question types apply to this position */
  questions: TrainingQuestion[];
  /** Source game info for context */
  source?: {
    white: string;
    black: string;
    event: string;
    year: number;
  };
  /** Difficulty level */
  difficulty: Difficulty;
  /** Tags for filtering */
  tags: string[];
}

export interface TrainingQuestion {
  type: QuestionType;
  /** The question text */
  question_de: string;
  question_en: string;
  /** Hint shown after first wrong answer */
  hint_de?: string;
  hint_en?: string;
  /** Explanation shown after answering (always educational) */
  explanation_de: string;
  explanation_en: string;
  /** The answer depends on question type */
  answer: TrainingAnswer;
  /** Points awarded for correct answer */
  points: number;
}

export type TrainingAnswer =
  | { type: 'squares'; squares: string[]; partialCredit?: boolean }
  | { type: 'choice'; options_de: string[]; options_en: string[]; correct: number }
  | { type: 'side'; correct: 'white' | 'black' | 'equal' }
  | { type: 'piece_on_square'; square: string }
  | { type: 'target_square'; from: string; to: string }
  | { type: 'move'; san: string; alternatives?: string[] };

// =====================================================
// CURATED TRAINING POSITIONS
// =====================================================

export const trainingPositions: TrainingPosition[] = [
  // ===== WEAK SQUARES =====
  {
    id: 'weak-sq-1',
    fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7',
    difficulty: 'beginner',
    tags: ['weak_squares', 'nimzo_indian', 'opening'],
    source: { white: 'Botvinnik', black: 'Capablanca', event: 'AVRO', year: 1938 },
    questions: [
      {
        type: 'weak_squares',
        question_de: 'Welche Felder in Weiss\' Stellung sind schwach nach dxc5?',
        question_en: 'Which squares in White\'s position are weak after dxc5?',
        hint_de: 'Schau auf die Felder, die nicht mehr von Bauern kontrolliert werden koennen',
        hint_en: 'Look at squares that can no longer be controlled by pawns',
        explanation_de: 'Die Felder d4 und c4 werden schwach, wenn Weiss auf c5 schlaegt. Der Laeufer auf b4 kontrolliert d2 und c3. Die Schwaeche auf d4 ist typisch fuer die Nimzo-Indische Verteidigung - Schwarz kann dort einen Springer platzieren!',
        explanation_en: 'The d4 and c4 squares become weak if White captures on c5. The bishop on b4 controls d2 and c3. The weakness on d4 is typical for the Nimzo-Indian Defense - Black can place a knight there!',
        answer: { type: 'squares', squares: ['d4', 'c4'], partialCredit: true },
        points: 20,
      },
      {
        type: 'who_is_better',
        question_de: 'Wer steht besser in dieser Stellung?',
        question_en: 'Who is better in this position?',
        explanation_de: 'Die Stellung ist ungefaehr gleich. Weiss hat das Laeufer-Paar, aber Schwarz hat eine solide Bauernstruktur und Druck auf das Zentrum. Typisch fuer die Nimzo-Indische!',
        explanation_en: 'The position is roughly equal. White has the bishop pair, but Black has a solid pawn structure and pressure on the center. Typical for the Nimzo-Indian!',
        answer: { type: 'side', correct: 'equal' },
        points: 10,
      },
    ],
  },

  // ===== PAWN STRUCTURE =====
  {
    id: 'pawn-struct-1',
    fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/2PNP3/2N1BP2/PP4PP/R2QKB1R w KQ - 0 8',
    difficulty: 'beginner',
    tags: ['pawn_structure', 'kings_indian', 'plans'],
    source: { white: 'Kramnik', black: 'Kasparov', event: 'WCh', year: 2000 },
    questions: [
      {
        type: 'pawn_structure',
        question_de: 'Welche Bauernstruktur ist das?',
        question_en: 'What pawn structure is this?',
        explanation_de: 'Das ist die Koenigsindische Struktur. Weiss kontrolliert das Zentrum mit Bauern auf c4, e4 und f3. Schwarz wird mit ...e5 oder ...c5 dagegen spielen. Diese Struktur fuehrt oft zu scharfem Spiel an verschiedenen Fluegeln!',
        explanation_en: 'This is the King\'s Indian structure. White controls the center with pawns on c4, e4, and f3. Black will counter with ...e5 or ...c5. This structure often leads to sharp play on opposite wings!',
        answer: {
          type: 'choice',
          options_de: [
            'Koenigsindische Struktur',
            'Sizilianische Struktur',
            'Franzoesische Struktur',
            'Caro-Kann Struktur',
          ],
          options_en: [
            'King\'s Indian Structure',
            'Sicilian Structure',
            'French Structure',
            'Caro-Kann Structure',
          ],
          correct: 0,
        },
        points: 15,
      },
      {
        type: 'find_the_plan',
        question_de: 'Was ist der typische Plan fuer Schwarz in dieser Stellung?',
        question_en: 'What is the typical plan for Black in this position?',
        hint_de: 'Schwarz muss das Zentrum herausfordern',
        hint_en: 'Black needs to challenge the center',
        explanation_de: '...e5 ist der klassische Gegenschlag! Nach ...e5 entsteht ein geschlossenes Zentrum, und Schwarz plant einen Koenigsfluegelangriff mit ...f5-f4, waehrend Weiss am Damenfluegle mit a4-a5 angreift. Das ist das Herz der Koenigsindischen Verteidigung!',
        explanation_en: '...e5 is the classic counterstrike! After ...e5, a closed center arises, and Black plans a kingside attack with ...f5-f4, while White attacks on the queenside with a4-a5. This is the heart of the King\'s Indian Defense!',
        answer: {
          type: 'choice',
          options_de: [
            '...e5 spielen und Koenigsfluegel-Angriff vorbereiten',
            '...a6 und ...b5 am Damenflügel',
            '...Sd4 sofort den Springer zentralisieren',
            'Abwarten und Figuren entwickeln',
          ],
          options_en: [
            'Play ...e5 and prepare kingside attack',
            '...a6 and ...b5 on the queenside',
            '...Nd4 immediately centralize the knight',
            'Wait and develop pieces',
          ],
          correct: 0,
        },
        points: 20,
      },
    ],
  },

  // ===== WORST PIECE =====
  {
    id: 'worst-piece-1',
    fen: 'r4rk1/pp2ppbp/2n3p1/q1pP4/4P3/2N2N2/PP2BPPP/R2Q1RK1 w - - 0 12',
    difficulty: 'intermediate',
    tags: ['piece_activity', 'benoni', 'middlegame'],
    questions: [
      {
        type: 'worst_piece',
        question_de: 'Welche Figur von Schwarz ist am schlechtesten platziert?',
        question_en: 'Which of Black\'s pieces is the worst placed?',
        hint_de: 'Welche Figur hat keine guten Felder?',
        hint_en: 'Which piece has no good squares?',
        explanation_de: 'Der Laeufer auf g7 wird durch den eigenen Bauern auf e7 eingesperrt und der Bauer auf d5 blockiert die Diagonale. In der Benoni-Struktur ist dieser "schlechte Laeufer" ein bekanntes Problem. Schwarz muss versuchen, ihn mit ...e6 oder ...b6+Lb7 zu aktivieren!',
        explanation_en: 'The bishop on g7 is blocked by its own pawn on e7, and the pawn on d5 blocks the diagonal. In the Benoni structure, this "bad bishop" is a well-known problem. Black must try to activate it with ...e6 or ...b6+Bb7!',
        answer: { type: 'piece_on_square', square: 'g7' },
        points: 15,
      },
    ],
  },

  // ===== WHO IS BETTER =====
  {
    id: 'eval-1',
    fen: 'r1b2rk1/2q1bppp/p1nppn2/1p6/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 0 12',
    difficulty: 'beginner',
    tags: ['evaluation', 'sicilian', 'middlegame'],
    source: { white: 'Fischer', black: 'Najdorf', event: 'Varna Olympiad', year: 1962 },
    questions: [
      {
        type: 'who_is_better',
        question_de: 'Wer steht besser?',
        question_en: 'Who is better?',
        explanation_de: 'Weiss steht besser! Die Figuren sind viel aktiver: Springer auf d4, Laeufer auf b3 zielt auf f7, Dame und Tuerme sind bereit fuer einen Angriff. Schwarz hat viele Figuren, aber sie sind noch nicht koordiniert. Fischer gewann diese Partie mit einem brillanten Angriff!',
        explanation_en: 'White is better! The pieces are much more active: knight on d4, bishop on b3 aims at f7, queen and rooks are ready for an attack. Black has many pieces but they are not yet coordinated. Fischer won this game with a brilliant attack!',
        answer: { type: 'side', correct: 'white' },
        points: 10,
      },
      {
        type: 'find_the_plan',
        question_de: 'Was ist der beste Plan fuer Weiss?',
        question_en: 'What is the best plan for White?',
        explanation_de: 'Weiss sollte den Koenigsfluegelangriff starten! g4-g5 ist ein typisches Motiv in der Sizilianischen Verteidigung mit langer Rochade. Der Bauer auf g5 vertreibt den Springer auf f6, der den Koenig verteidigt. Fischer spielte genau so!',
        explanation_en: 'White should launch the kingside attack! g4-g5 is a typical motif in the Sicilian with opposite-side castling. The pawn on g5 chases away the knight on f6 that defends the king. Fischer played exactly like this!',
        answer: {
          type: 'choice',
          options_de: [
            'g4-g5 Koenigsfluegelangriff starten',
            'a4 am Damenfluegle spielen',
            'Sc6 den Springer tauschen',
            'f4-f5 das Zentrum oeffnen',
          ],
          options_en: [
            'g4-g5 launch kingside attack',
            'a4 play on the queenside',
            'Nxc6 trade the knight',
            'f4-f5 open the center',
          ],
          correct: 0,
        },
        points: 20,
      },
    ],
  },

  // ===== PIECE PLACEMENT =====
  {
    id: 'placement-1',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bP5/2N1PN2/PPQB1PPP/R3KB1R w KQ - 0 7',
    difficulty: 'beginner',
    tags: ['piece_placement', 'opening', 'development'],
    questions: [
      {
        type: 'piece_placement',
        question_de: 'Wohin sollte der Laeufer von f1 entwickelt werden?',
        question_en: 'Where should the bishop from f1 be developed?',
        hint_de: 'Der Laeufer braucht eine aktive Diagonale',
        hint_en: 'The bishop needs an active diagonal',
        explanation_de: 'Der Laeufer gehoert nach e2 oder d3! Von e2 aus kann er spaeter nach f3 oder nach g4 gehen. Von d3 kontrolliert er wichtige Felder im Zentrum und stuetzt den Bauernvorstoss e4. Nicht nach b5 - dort wird er von ...a6 vertrieben!',
        explanation_en: 'The bishop belongs on e2 or d3! From e2 it can later go to f3 or g4. From d3 it controls important central squares and supports the e4 pawn push. Not b5 - it gets chased away by ...a6!',
        answer: { type: 'target_square', from: 'f1', to: 'e2' },
        points: 15,
      },
    ],
  },

  // ===== EXCHANGE DECISION =====
  {
    id: 'exchange-1',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    difficulty: 'beginner',
    tags: ['exchange', 'italian', 'opening'],
    questions: [
      {
        type: 'exchange_decision',
        question_de: 'Sollte Weiss den Laeufer gegen den Springer auf c6 tauschen (Lxc6)?',
        question_en: 'Should White trade the bishop for the knight on c6 (Bxc6)?',
        explanation_de: 'Nein! Der Laeufer auf c4 ist sehr stark - er zielt auf f7, den schwachen Punkt in Schwarz\' Stellung. Im Italienisch moechte Weiss das Laeufer-Paar behalten. Laeufer tauscht man nur, wenn man einen konkreten Vorteil bekommt. Hier waere der Tausch ein Geschenk an Schwarz!',
        explanation_en: 'No! The bishop on c4 is very strong - it aims at f7, the weak point in Black\'s position. In the Italian Game, White wants to keep the bishop pair. You only trade bishops when you get a concrete advantage. Here the trade would be a gift to Black!',
        answer: {
          type: 'choice',
          options_de: [
            'Nein - der Laeufer ist zu stark auf c4',
            'Ja - doppelt die Bauern auf c6',
            'Ja - vereinfacht die Stellung',
            'Egal - beides ist gleich gut',
          ],
          options_en: [
            'No - the bishop is too strong on c4',
            'Yes - doubles the pawns on c6',
            'Yes - simplifies the position',
            'Doesn\'t matter - both are equally good',
          ],
          correct: 0,
        },
        points: 15,
      },
    ],
  },

  // ===== ATTACK OR DEFEND =====
  {
    id: 'attack-defend-1',
    fen: 'r1b2rk1/ppq1bppp/2npp3/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 0 10',
    difficulty: 'intermediate',
    tags: ['attack_defend', 'sicilian', 'middlegame'],
    questions: [
      {
        type: 'attack_or_defend',
        question_de: 'Sollte Weiss hier angreifen oder erst seine Stellung verbessern?',
        question_en: 'Should White attack here or first improve the position?',
        explanation_de: 'Weiss sollte angreifen! Alle Figuren sind entwickelt und aktiv. Der Springer auf d4 und Laeufer auf c4 zielen auf den Koenigsfluegle. f4-f5 oder Dh5 sind typische Angriffsideen. Wenn man einen Entwicklungsvorsprung hat, muss man schnell handeln, bevor der Gegner aufholt!',
        explanation_en: 'White should attack! All pieces are developed and active. The knight on d4 and bishop on c4 aim at the kingside. f4-f5 or Qh5 are typical attacking ideas. When you have a development lead, you must act quickly before the opponent catches up!',
        answer: {
          type: 'choice',
          options_de: [
            'Angreifen! Weiss hat einen Entwicklungsvorsprung',
            'Verteidigen und abwarten',
            'Damentausch anbieten',
            'Am Damenfluegle spielen mit a4-a5',
          ],
          options_en: [
            'Attack! White has a development lead',
            'Defend and wait',
            'Offer a queen trade',
            'Play on the queenside with a4-a5',
          ],
          correct: 0,
        },
        points: 15,
      },
    ],
  },

  // ===== GUESS THE MOVE (with explanation) =====
  {
    id: 'best-move-1',
    fen: 'r1bqkb1r/pppppppp/2n2n2/8/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'beginner',
    tags: ['best_move', 'opening', 'development'],
    questions: [
      {
        type: 'best_move',
        question_de: 'Was ist der beste Zug fuer Weiss? (Denke an Zentrumskontrolle!)',
        question_en: 'What is the best move for White? (Think about center control!)',
        hint_de: 'Weiss will mehr Platz im Zentrum',
        hint_en: 'White wants more space in the center',
        explanation_de: 'd4 ist am besten! Weiss beansprucht mehr Raum im Zentrum und oeffnet Linien fuer den Laeufer. Nach 3.d4 exd4 4.Sxd4 hat Weiss eine ideale Stellung. Aber auch Sf3 und Lc4 sind gute Zuege - Entwicklung ist der Schluessel in der Eroeffnung!',
        explanation_en: 'd4 is best! White claims more space in the center and opens lines for the bishop. After 3.d4 exd4 4.Nxd4, White has an ideal position. But Nf3 and Bc4 are also good moves - development is the key in the opening!',
        answer: { type: 'move', san: 'd4', alternatives: ['Nf3', 'Bc4'] },
        points: 15,
      },
    ],
  },

  // ===== WEAK SQUARES ADVANCED =====
  {
    id: 'weak-sq-2',
    fen: 'r2q1rk1/ppp1bppp/3p1n2/4p3/2P1P3/2NB1N2/PP3PPP/R2Q1RK1 w - - 0 10',
    difficulty: 'intermediate',
    tags: ['weak_squares', 'middlegame', 'positional'],
    questions: [
      {
        type: 'weak_squares',
        question_de: 'Welche Felder sind die wichtigsten schwachen Felder fuer Schwarz?',
        question_en: 'Which are the most important weak squares for Black?',
        hint_de: 'Die Bauernstruktur ...d6+...e5 laesst Loecher',
        hint_en: 'The pawn structure ...d6+...e5 leaves holes',
        explanation_de: 'd5 und f5 sind die Schluesselfelder! Nach ...e5 kann Schwarz diese Felder nicht mehr mit Bauern kontrollieren. Ein weisser Springer auf d5 waere extrem stark - er kann nicht vertrieben werden! Diese "Loecher" in der Bauernkette sind typisch wenn Schwarz ...e5 spielt.',
        explanation_en: 'd5 and f5 are the key squares! After ...e5, Black can no longer control these squares with pawns. A white knight on d5 would be extremely strong - it cannot be chased away! These "holes" in the pawn chain are typical when Black plays ...e5.',
        answer: { type: 'squares', squares: ['d5', 'f5'], partialCredit: true },
        points: 20,
      },
    ],
  },
];

// =====================================================
// HELPERS
// =====================================================

export function getPositionsByDifficulty(difficulty: Difficulty): TrainingPosition[] {
  return trainingPositions.filter((p) => p.difficulty === difficulty);
}

export function getPositionsByTag(tag: string): TrainingPosition[] {
  return trainingPositions.filter((p) => p.tags.includes(tag));
}

export function getAllQuestionTypes(): QuestionType[] {
  const types = new Set<QuestionType>();
  for (const pos of trainingPositions) {
    for (const q of pos.questions) {
      types.add(q.type);
    }
  }
  return Array.from(types);
}

export const questionTypeInfo: Record<QuestionType, { icon: string; de: string; en: string }> = {
  weak_squares: { icon: '🕳', de: 'Schwache Felder', en: 'Weak Squares' },
  who_is_better: { icon: '⚖', de: 'Wer steht besser?', en: 'Who is Better?' },
  find_the_plan: { icon: '🎯', de: 'Finde den Plan', en: 'Find the Plan' },
  worst_piece: { icon: '😴', de: 'Schlechteste Figur', en: 'Worst Piece' },
  best_move: { icon: '♟', de: 'Bester Zug', en: 'Best Move' },
  pawn_structure: { icon: '🏗', de: 'Bauernstruktur', en: 'Pawn Structure' },
  piece_placement: { icon: '📍', de: 'Figurenplatzierung', en: 'Piece Placement' },
  attack_or_defend: { icon: '⚔', de: 'Angriff oder Verteidigung?', en: 'Attack or Defend?' },
  exchange_decision: { icon: '🔄', de: 'Tauschen oder nicht?', en: 'Trade or Keep?' },
};
