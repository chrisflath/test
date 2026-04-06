/**
 * Position Evaluation Trainer
 *
 * The kid evaluates a position by scoring each factor on a scale:
 *   -3 (big Black advantage) to +3 (big White advantage)
 *
 * Factors:
 *   Material      - piece count (easiest, most concrete)
 *   Development   - how many pieces are active / developed
 *   King Safety   - castled? exposed? attackers nearby?
 *   Pawn Structure - weak pawns, passed pawns, pawn chains
 *   Space         - who controls more of the board
 *   Piece Activity - are pieces on good squares, coordinated?
 *
 * After submitting, they see a comparison:
 *   Their scores vs the "correct" evaluation with explanations.
 *   A total weighted score gives the overall assessment.
 *
 * This teaches structured thinking about positions.
 */

export interface EvalFactor {
  id: EvalFactorId;
  icon: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  /** How important this factor is (for weighted total) */
  weight: number;
}

export type EvalFactorId =
  | 'material'
  | 'development'
  | 'king_safety'
  | 'pawn_structure'
  | 'space'
  | 'piece_activity';

export const evalFactors: EvalFactor[] = [
  {
    id: 'material',
    icon: '♛',
    name_de: 'Material',
    name_en: 'Material',
    description_de: 'Zaehle die Figurenwerte: Dame=9, Turm=5, Laeufer=3, Springer=3, Bauer=1',
    description_en: 'Count piece values: Queen=9, Rook=5, Bishop=3, Knight=3, Pawn=1',
    weight: 3,
  },
  {
    id: 'development',
    icon: '🏃',
    name_de: 'Entwicklung',
    name_en: 'Development',
    description_de: 'Wie viele Figuren sind entwickelt? Wer hat mehr Figuren im Spiel?',
    description_en: 'How many pieces are developed? Who has more pieces in the game?',
    weight: 2,
  },
  {
    id: 'king_safety',
    icon: '🛡',
    name_de: 'Koenigssicherheit',
    name_en: 'King Safety',
    description_de: 'Ist der Koenig rochiert? Sind die Bauern vor dem Koenig intakt? Gibt es Angreifer?',
    description_en: 'Is the king castled? Are the pawns in front intact? Are there attackers?',
    weight: 3,
  },
  {
    id: 'pawn_structure',
    icon: '🏗',
    name_de: 'Bauernstruktur',
    name_en: 'Pawn Structure',
    description_de: 'Doppelbauern? Isolierte Bauern? Freibauern? Bauernketten?',
    description_en: 'Doubled pawns? Isolated pawns? Passed pawns? Pawn chains?',
    weight: 2,
  },
  {
    id: 'space',
    icon: '📐',
    name_de: 'Raum',
    name_en: 'Space',
    description_de: 'Wer kontrolliert mehr Felder? Wer hat mehr Platz fuer seine Figuren?',
    description_en: 'Who controls more squares? Who has more room for their pieces?',
    weight: 1,
  },
  {
    id: 'piece_activity',
    icon: '⚡',
    name_de: 'Figurenaktivitaet',
    name_en: 'Piece Activity',
    description_de: 'Stehen die Figuren auf guten Feldern? Arbeiten sie zusammen? Gibt es schlechte Figuren?',
    description_en: 'Are pieces on good squares? Do they work together? Are there bad pieces?',
    weight: 2,
  },
];

/** Scale: -3 to +3 */
export type EvalScore = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface FactorScore {
  factorId: EvalFactorId;
  score: EvalScore;
  /** Short explanation why this score */
  explanation_de: string;
  explanation_en: string;
}

export interface EvalPosition {
  id: string;
  fen: string;
  /** Correct evaluation per factor */
  factors: FactorScore[];
  /** Overall summary explanation */
  summary_de: string;
  summary_en: string;
  /** Who actually stands better */
  verdict: 'white' | 'black' | 'equal';
  /** Source game */
  source?: {
    white: string;
    black: string;
    event: string;
    year: number;
  };
  /** Difficulty */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// =====================================================
// CURATED EVALUATION POSITIONS
// =====================================================

export const evalPositions: EvalPosition[] = [
  {
    id: 'eval-material-1',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    difficulty: 'beginner',
    source: { white: 'Scholar', black: 'Mate', event: 'Lesson', year: 2024 },
    verdict: 'white',
    summary_de: 'Material ist gleich, aber Weiss hat einen grossen Entwicklungsvorsprung und droht bereits Matt auf f7! Der Laeufer auf c4 und die Dame auf h5 zielen beide auf f7. Schwarz muss sehr vorsichtig spielen.',
    summary_en: 'Material is equal, but White has a huge development lead and already threatens mate on f7! The bishop on c4 and queen on h5 both aim at f7. Black must play very carefully.',
    factors: [
      {
        factorId: 'material',
        score: 0,
        explanation_de: 'Beide Seiten haben gleiches Material',
        explanation_en: 'Both sides have equal material',
      },
      {
        factorId: 'development',
        score: 2,
        explanation_de: 'Weiss hat 2 Figuren entwickelt (Lc4, Dh5), Schwarz auch 2 (Sc6, Sf6) - aber Weiss\' Figuren sind viel aggressiver platziert!',
        explanation_en: 'White has 2 pieces developed (Bc4, Qh5), Black also 2 (Nc6, Nf6) - but White\'s pieces are much more aggressively placed!',
      },
      {
        factorId: 'king_safety',
        score: 2,
        explanation_de: 'Schwarz\' Koenig ist auf e8 gefangen und f7 ist extrem schwach. Weiss droht Dxf7#! Der weisse Koenig ist auch nicht rochiert, aber nicht bedroht.',
        explanation_en: 'Black\'s king is stuck on e8 and f7 is extremely weak. White threatens Qxf7#! White\'s king is also uncastled but not under threat.',
      },
      {
        factorId: 'pawn_structure',
        score: 0,
        explanation_de: 'Beide haben eine normale Bauernstruktur, keine Schwaechen',
        explanation_en: 'Both have a normal pawn structure, no weaknesses',
      },
      {
        factorId: 'space',
        score: 1,
        explanation_de: 'Weiss kontrolliert mit dem Bauern auf e4 etwas mehr Raum',
        explanation_en: 'White controls slightly more space with the pawn on e4',
      },
      {
        factorId: 'piece_activity',
        score: 3,
        explanation_de: 'Weiss\' Figuren sind perfekt koordiniert: Lc4 und Dh5 drohen zusammen Matt! Das ist ein riesiger Aktivitaetsvorteil.',
        explanation_en: 'White\'s pieces are perfectly coordinated: Bc4 and Qh5 together threaten mate! This is a huge activity advantage.',
      },
    ],
  },

  {
    id: 'eval-endgame-1',
    fen: '8/5pk1/6p1/4P3/5PP1/8/8/6K1 w - - 0 40',
    difficulty: 'beginner',
    source: { white: 'Lesson', black: 'Endgame', event: 'Pawn Ending', year: 2024 },
    verdict: 'white',
    summary_de: 'Im Bauernendspiel zaehlt vor allem Material und Bauernstruktur. Weiss hat 3 Bauern gegen 2 und einen gefaehrlichen Freibauern auf e5. Der Bauer auf e5 ist sehr nah an der Umwandlung!',
    summary_en: 'In pawn endings, material and pawn structure matter most. White has 3 pawns vs 2 and a dangerous passed pawn on e5. The pawn on e5 is very close to promotion!',
    factors: [
      {
        factorId: 'material',
        score: 1,
        explanation_de: 'Weiss hat 3 Bauern, Schwarz hat 2 Bauern. Ein Bauer mehr ist im Endspiel sehr wichtig!',
        explanation_en: 'White has 3 pawns, Black has 2 pawns. One extra pawn is very important in the endgame!',
      },
      {
        factorId: 'development',
        score: 0,
        explanation_de: 'Im Endspiel spielt Entwicklung keine Rolle mehr',
        explanation_en: 'Development doesn\'t matter in the endgame',
      },
      {
        factorId: 'king_safety',
        score: 0,
        explanation_de: 'Im Bauernendspiel sind die Koenige beide aktiv und sicher',
        explanation_en: 'In pawn endings, both kings are active and safe',
      },
      {
        factorId: 'pawn_structure',
        score: 2,
        explanation_de: 'Weiss hat einen Freibauern auf e5 - das ist ein riesiger Vorteil! Der Bauer kann nur schwer gestoppt werden.',
        explanation_en: 'White has a passed pawn on e5 - that\'s a huge advantage! The pawn is hard to stop.',
      },
      {
        factorId: 'space',
        score: 1,
        explanation_de: 'Der e5-Bauer gibt Weiss mehr Raum und schraenkt den schwarzen Koenig ein',
        explanation_en: 'The e5 pawn gives White more space and restricts the black king',
      },
      {
        factorId: 'piece_activity',
        score: 0,
        explanation_de: 'Beide Koenige sind ungefaehr gleich aktiv',
        explanation_en: 'Both kings are roughly equally active',
      },
    ],
  },

  {
    id: 'eval-sicilian-1',
    fen: 'r1b2rk1/2q1bppp/p1nppn2/1p6/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 0 12',
    difficulty: 'intermediate',
    source: { white: 'Fischer', black: 'Najdorf', event: 'Varna Olympiad', year: 1962 },
    verdict: 'white',
    summary_de: 'Fischer hat eine klassische Sizilianisch-Angriffsstellung. Material ist gleich, aber Weiss\' Figuren sind viel besser koordiniert fuer einen Koenigsfluegelangriff. Die lange Rochade gibt Weiss die Moeglichkeit, mit g4-g5 den Koenig anzugreifen.',
    summary_en: 'Fischer has a classic Sicilian attacking setup. Material is equal, but White\'s pieces are much better coordinated for a kingside attack. Castling long gives White the option to attack with g4-g5.',
    factors: [
      {
        factorId: 'material',
        score: 0,
        explanation_de: 'Gleiches Material',
        explanation_en: 'Equal material',
      },
      {
        factorId: 'development',
        score: 1,
        explanation_de: 'Weiss hat alle Figuren ideal entwickelt. Schwarz hat auch entwickelt, aber der Lc8 ist noch eingesperrt.',
        explanation_en: 'White has all pieces ideally developed. Black is also developed but the Bc8 is still trapped.',
      },
      {
        factorId: 'king_safety',
        score: 1,
        explanation_de: 'Beide Koenige sind rochiert. Aber Weiss\' Koenig auf c1 ist sicherer, weil Schwarz keinen offensichtlichen Angriff hat. Schwarz\' Koenig auf g8 wird bald unter Druck stehen durch g4-g5.',
        explanation_en: 'Both kings are castled. But White\'s king on c1 is safer because Black has no obvious attack. Black\'s king on g8 will soon be under pressure from g4-g5.',
      },
      {
        factorId: 'pawn_structure',
        score: 0,
        explanation_de: 'Beide haben typische Sizilianisch-Strukturen. Weiss hat den e4-Bauern, Schwarz die Mehrheit am Damenflügel.',
        explanation_en: 'Both have typical Sicilian structures. White has the e4 pawn, Black the queenside majority.',
      },
      {
        factorId: 'space',
        score: 1,
        explanation_de: 'Weiss kontrolliert mit e4 und dem Springer auf d4 mehr Raum im Zentrum',
        explanation_en: 'White controls more central space with e4 and the knight on d4',
      },
      {
        factorId: 'piece_activity',
        score: 2,
        explanation_de: 'Weiss\' Figuren sind perfekt koordiniert: Sd4 kontrolliert das Zentrum, Lb3 zielt auf f7, Dame auf d2 unterstuetzt den Angriff, Tuerme sind verbunden. Schwarz\' Lc8 ist schlecht.',
        explanation_en: 'White\'s pieces are perfectly coordinated: Nd4 controls the center, Bb3 aims at f7, queen on d2 supports the attack, rooks are connected. Black\'s Bc8 is bad.',
      },
    ],
  },

  {
    id: 'eval-isolated-1',
    fen: 'r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2PB1N2/PP3PPP/R1BQ1RK1 w - - 0 9',
    difficulty: 'beginner',
    verdict: 'equal',
    summary_de: 'Klassisches Beispiel: Schwarz hat einen isolierten Damenbauern auf d5. Das klingt schlecht, aber der Bauer kontrolliert wichtige Felder (c4, e4) und gibt Schwarz aktives Figurenspiel. Die Stellung ist ausgeglichen - der isolierte Bauer ist sowohl Staerke als auch Schwaeche!',
    summary_en: 'Classic example: Black has an isolated queen\'s pawn on d5. That sounds bad, but the pawn controls key squares (c4, e4) and gives Black active piece play. The position is balanced - the isolated pawn is both strength and weakness!',
    factors: [
      {
        factorId: 'material',
        score: 0,
        explanation_de: 'Gleiches Material',
        explanation_en: 'Equal material',
      },
      {
        factorId: 'development',
        score: 0,
        explanation_de: 'Beide Seiten sind gut entwickelt und rochiert',
        explanation_en: 'Both sides are well developed and castled',
      },
      {
        factorId: 'king_safety',
        score: 0,
        explanation_de: 'Beide Koenige sind sicher rochiert',
        explanation_en: 'Both kings are safely castled',
      },
      {
        factorId: 'pawn_structure',
        score: 1,
        explanation_de: 'Schwarz hat einen isolierten d-Bauern - das ist eine Schwaeche im Endspiel, aber gibt Aktivitaet im Mittelspiel. Weiss hat eine gesunde Struktur mit c3.',
        explanation_en: 'Black has an isolated d-pawn - that\'s a weakness in the endgame but gives activity in the middlegame. White has a healthy structure with c3.',
      },
      {
        factorId: 'space',
        score: -1,
        explanation_de: 'Der d5-Bauer gibt Schwarz etwas mehr Raum und kontrolliert c4 und e4',
        explanation_en: 'The d5 pawn gives Black slightly more space and controls c4 and e4',
      },
      {
        factorId: 'piece_activity',
        score: -1,
        explanation_de: 'Schwarz\' Figuren sind etwas aktiver: die Springer koennen nach e4 oder c4, der Laeufer hat offene Diagonalen. Weiss muss den d5-Bauern blockieren.',
        explanation_en: 'Black\'s pieces are slightly more active: the knights can go to e4 or c4, the bishop has open diagonals. White must blockade the d5 pawn.',
      },
    ],
  },

  {
    id: 'eval-opposite-castle-1',
    fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/2PNP3/2N1B3/PP2BPPP/R2QK2R w KQ - 0 8',
    difficulty: 'intermediate',
    source: { white: 'Theory', black: 'Position', event: 'King\'s Indian', year: 2024 },
    verdict: 'equal',
    summary_de: 'Koenigsindisch vor dem Sturm! Material und Entwicklung sind gleich. Der Schluessel ist: Weiss wird am Damenfluegle angreifen (c5, a4-a5), Schwarz am Koenigsfluegle (...f5-f4-f3). Wer zuerst ankommt, gewinnt! Im Moment ist alles ausgeglichen.',
    summary_en: 'King\'s Indian before the storm! Material and development are equal. The key: White will attack on the queenside (c5, a4-a5), Black on the kingside (...f5-f4-f3). Whoever arrives first wins! Right now everything is balanced.',
    factors: [
      {
        factorId: 'material',
        score: 0,
        explanation_de: 'Gleiches Material',
        explanation_en: 'Equal material',
      },
      {
        factorId: 'development',
        score: 0,
        explanation_de: 'Beide Seiten sind vollstaendig entwickelt',
        explanation_en: 'Both sides are fully developed',
      },
      {
        factorId: 'king_safety',
        score: 0,
        explanation_de: 'Schwarz ist rochiert, Weiss wird kurz rochieren. Beide Koenige werden bald unter Angriff stehen - das ist typisch fuer diese Eroeffnung!',
        explanation_en: 'Black is castled, White will castle shortly. Both kings will soon be under attack - typical for this opening!',
      },
      {
        factorId: 'pawn_structure',
        score: 0,
        explanation_de: 'Beide haben gesunde Strukturen. Weiss hat den Raumvorteil im Zentrum, Schwarz hat eine flexible Struktur am Koenigsfluegel.',
        explanation_en: 'Both have healthy structures. White has the spatial advantage in the center, Black has a flexible kingside structure.',
      },
      {
        factorId: 'space',
        score: 1,
        explanation_de: 'Weiss kontrolliert mit c4 und e4 mehr Raum im Zentrum',
        explanation_en: 'White controls more central space with c4 and e4',
      },
      {
        factorId: 'piece_activity',
        score: 0,
        explanation_de: 'Beide haben ihre Figuren auf guten Feldern. Der Lg7 wartet auf ...e5 um aktiv zu werden.',
        explanation_en: 'Both have their pieces on good squares. The Bg7 waits for ...e5 to become active.',
      },
    ],
  },
];

// =====================================================
// SCALE LABELS
// =====================================================

export const scaleLabels: Record<number, { de: string; en: string }> = {
  '-3': { de: 'Schwarz viel besser', en: 'Black much better' },
  '-2': { de: 'Schwarz klar besser', en: 'Black clearly better' },
  '-1': { de: 'Schwarz etwas besser', en: 'Black slightly better' },
  '0': { de: 'Gleich', en: 'Equal' },
  '1': { de: 'Weiss etwas besser', en: 'White slightly better' },
  '2': { de: 'Weiss klar besser', en: 'White clearly better' },
  '3': { de: 'Weiss viel besser', en: 'White much better' },
};
