/**
 * Curated opening plans and middlegame ideas.
 * Each entry is keyed by ECO code prefix and contains:
 * - Plans for both White and Black
 * - Key ideas explained in kid-friendly language
 * - Typical pawn structures and piece placements
 */

export interface MiddlegamePlan {
  eco: string;
  opening: string;
  /** Short, exciting summary for the opening */
  hook_de: string;
  hook_en: string;
  /** Plans for White */
  whitePlans_de: string[];
  whitePlans_en: string[];
  /** Plans for Black */
  blackPlans_de: string[];
  blackPlans_en: string[];
  /** Key squares and pieces to watch */
  keyIdeas_de: string[];
  keyIdeas_en: string[];
  /** Pawn structure type */
  structure: string;
}

export const openingPlans: MiddlegamePlan[] = [
  // === ITALIAN GAME ===
  {
    eco: 'C50',
    opening: 'Italian Game',
    hook_de: 'Die klassischste Eroeffnung im Schach - seit ueber 500 Jahren gespielt!',
    hook_en: 'The most classical opening in chess - played for over 500 years!',
    whitePlans_de: [
      'Baue ein starkes Zentrum mit d2-d4 auf',
      'Greife am Koenigsfluegelgel an: Turm nach f1, dann f2-f4',
      'Nutze den Laeufer auf c4 um f7 unter Druck zu setzen',
      'Bringe alle Figuren ins Spiel bevor du angreifst',
    ],
    whitePlans_en: [
      'Build a strong center with d2-d4',
      'Attack on the kingside: Rook to f1, then f2-f4',
      'Use the bishop on c4 to pressure f7',
      'Develop all pieces before attacking',
    ],
    blackPlans_de: [
      'Halte das Zentrum mit d7-d6 oder d7-d5',
      'Entwickle den Laeufer nach e6 oder g4',
      'Gegenspiel am Damenfluegelgel mit a7-a5 und b7-b5',
      'Tausche den starken Laeufer auf c4 ab wenn moeglich',
    ],
    blackPlans_en: [
      'Hold the center with d7-d6 or d7-d5',
      'Develop the bishop to e6 or g4',
      'Counterplay on the queenside with a7-a5 and b7-b5',
      'Trade off the strong bishop on c4 if possible',
    ],
    keyIdeas_de: [
      'Das Feld d4 ist der Schluessel zum Zentrum',
      'Der Bauer auf f7 ist am Anfang der schwaeachste Punkt',
      'Rochiere frueh um den Koenig in Sicherheit zu bringen',
    ],
    keyIdeas_en: [
      'The d4 square is the key to the center',
      'The f7 pawn is the weakest point at the start',
      'Castle early to keep the king safe',
    ],
    structure: 'open-center',
  },

  // === RUY LOPEZ ===
  {
    eco: 'C60',
    opening: 'Ruy Lopez / Spanische Partie',
    hook_de: 'Die Koenigin der Eroeffnungen - von Weltmeistern seit Jahrhunderten gespielt!',
    hook_en: 'The queen of openings - played by world champions for centuries!',
    whitePlans_de: [
      'Baue langsam ein Zentrum auf mit d2-d4',
      'Der Springer auf f3 kontrolliert das Zentrum - nicht tauschen!',
      'Laeufer zurueck nach a4 oder b3, dann Koenigsangriff vorbereiten',
      'Der Manoevrierplan: Springer von f3 nach g3 nach f5!',
      'Turm auf die e-Linie fuer Druck',
    ],
    whitePlans_en: [
      'Slowly build a center with d2-d4',
      'The knight on f3 controls the center - do not trade!',
      'Bishop back to a4 or b3, then prepare kingside attack',
      'The maneuver plan: Knight from f3 to g3 to f5!',
      'Rook on the e-file for pressure',
    ],
    blackPlans_de: [
      'Gegenspiel am Damenfluegel mit b5, Lb7 und c5',
      'Der Marshall-Angriff: Opfere einen Bauern fuer Angriff!',
      'Halte den Springer auf f6 als Verteidiger',
      'Suche nach dem Befreiungsschlag d6-d5',
    ],
    blackPlans_en: [
      'Counterplay on the queenside with b5, Bb7 and c5',
      'The Marshall Attack: sacrifice a pawn for attack!',
      'Keep the knight on f6 as a defender',
      'Look for the freeing break d6-d5',
    ],
    keyIdeas_de: [
      'Geduld! Die Spanische Partie ist ein langsames Spiel',
      'Wer das Zentrum kontrolliert, kontrolliert die Partie',
      'Der Laeufer auf b5/a4 ist ein langfristiger Vorteil',
    ],
    keyIdeas_en: [
      'Patience! The Ruy Lopez is a slow game',
      'Whoever controls the center controls the game',
      'The bishop on b5/a4 is a long-term advantage',
    ],
    structure: 'closed-center',
  },

  // === SICILIAN DEFENSE ===
  {
    eco: 'B20',
    opening: 'Sicilian Defense / Sizilianische Verteidigung',
    hook_de: 'Die schaerfste Antwort auf 1.e4 - hier wird gekaeampft!',
    hook_en: 'The sharpest answer to 1.e4 - a real fight from move one!',
    whitePlans_de: [
      'Koenigsangriff! Figuren zum Koenigsfluegel bringen',
      'f2-f4-f5 Vormarsch fuer den Durchbruch',
      'Laeufer auf e3, Dame auf d2 - dann lang rochieren und angreifen!',
      'Den d5-Vorsto nutzen um Linien zu oeffnen',
    ],
    whitePlans_en: [
      'Kingside attack! Bring pieces to the kingside',
      'f2-f4-f5 advance for the breakthrough',
      'Bishop on e3, Queen on d2 - then castle long and attack!',
      'Use the d5 push to open lines',
    ],
    blackPlans_de: [
      'Gegenspiel am Damenfluegel mit a6, b5, b4',
      'Die halboffene c-Linie fuer den Turm nutzen',
      'Springer nach c6 und dann nach d4 - der beste Feld!',
      'Tausche Figuren ab wenn du unter Druck stehst',
    ],
    blackPlans_en: [
      'Queenside counterplay with a6, b5, b4',
      'Use the half-open c-file for the rook',
      'Knight to c6 then to d4 - the best square!',
      'Trade pieces if you are under pressure',
    ],
    keyIdeas_de: [
      'Sizilianisch = Schwarz greift am Damenfluegel an, Weiss am Koenigsfluegel',
      'Wer schneller ist, gewinnt!',
      'Das Feld d4 ist Gold wert fuer einen Springer',
    ],
    keyIdeas_en: [
      'Sicilian = Black attacks on the queenside, White on the kingside',
      'Whoever is faster wins!',
      'The d4 square is worth gold for a knight',
    ],
    structure: 'sicilian-pawn',
  },

  // === FRENCH DEFENSE ===
  {
    eco: 'C00',
    opening: 'French Defense / Franzoesische Verteidigung',
    hook_de: 'Solide wie eine Festung! Schwarz baut eine Mauer und greift dann an.',
    hook_en: 'Solid as a fortress! Black builds a wall and then attacks.',
    whitePlans_de: [
      'Raumvorteil am Koenigsfluegel nutzen',
      'f4-f5 Vorsto fuer den Angriff',
      'Den Laeufer auf d3 behalten - er zielt auf h7',
      'Springer nach f3, dann nach g5 oder e5',
    ],
    whitePlans_en: [
      'Use the space advantage on the kingside',
      'f4-f5 push for the attack',
      'Keep the bishop on d3 - it aims at h7',
      'Knight to f3, then to g5 or e5',
    ],
    blackPlans_de: [
      'Gegenspiel mit c7-c5! Sofort das Zentrum angreifen',
      'Der Befreiungsschlag f7-f6 oeffnet das Spiel',
      'Figuren ueber c8-d7-c6 entwickeln',
      'Den schlechten Laeufer auf c8 aktivieren (nach b7 oder a6)',
    ],
    blackPlans_en: [
      'Counterplay with c7-c5! Attack the center immediately',
      'The freeing break f7-f6 opens the game',
      'Develop pieces via c8-d7-c6',
      'Activate the bad bishop on c8 (to b7 or a6)',
    ],
    keyIdeas_de: [
      'Der Laeufer auf c8 ist Schwarz groesstes Problem - aktiviere ihn!',
      'Die Bauernkette e4-d4 vs e6-d5 bestimmt das ganze Spiel',
      'Schwarz muss geduldig sein und auf den richtigen Moment warten',
    ],
    keyIdeas_en: [
      'The bishop on c8 is Black\'s biggest problem - activate it!',
      'The pawn chain e4-d4 vs e6-d5 determines the whole game',
      'Black must be patient and wait for the right moment',
    ],
    structure: 'french-pawn-chain',
  },

  // === QUEEN'S GAMBIT ===
  {
    eco: 'D30',
    opening: 'Queen\'s Gambit / Damengambit',
    hook_de: 'Das Damengambit aus der Netflix-Serie! Beth Harmon laesst gruessen.',
    hook_en: 'The Queen\'s Gambit from the Netflix series! Beth Harmon says hello.',
    whitePlans_de: [
      'Minoritaetsangriff: a2-a4, b2-b4-b5 am Damenfluegel',
      'Druck auf der c-Linie mit Turm auf c1',
      'Laeufer auf g5 um den Springer auf f6 zu fesseln',
      'Wenn Schwarz cxd4 tauscht: isolierten d-Bauern ausnutzen',
    ],
    whitePlans_en: [
      'Minority attack: a2-a4, b2-b4-b5 on the queenside',
      'Pressure on the c-file with rook on c1',
      'Bishop on g5 to pin the knight on f6',
      'If Black plays cxd4: exploit the isolated d-pawn',
    ],
    blackPlans_de: [
      'Solide aufbauen mit e6, Sf6, Le7, 0-0',
      'Den Befreiungsschlag c6-c5 oder e6-e5 vorbereiten',
      'Springer nach e4 bringen - das beste Feld!',
      'Nicht zu frueh c5 spielen - erst alles entwickeln',
    ],
    blackPlans_en: [
      'Build solidly with e6, Nf6, Be7, 0-0',
      'Prepare the freeing break c6-c5 or e6-e5',
      'Bring the knight to e4 - the best square!',
      'Don\'t play c5 too early - develop everything first',
    ],
    keyIdeas_de: [
      'Das Damengambit ist kein echtes Gambit - der Bauer wird zurueckgewonnen',
      'Geduld und Positionsspiel sind hier der Schluessel',
      'Wer den e4/e5-Vorsto durchsetzt, steht meistens besser',
    ],
    keyIdeas_en: [
      'The Queen\'s Gambit is not a real gambit - the pawn is won back',
      'Patience and positional play are the key here',
      'Whoever achieves the e4/e5 push usually stands better',
    ],
    structure: 'queens-gambit',
  },

  // === KING'S INDIAN DEFENSE ===
  {
    eco: 'E60',
    opening: 'King\'s Indian Defense / Koenigsindische Verteidigung',
    hook_de: 'Die Lieblingseroeffnung von Kasparov! Voller Feuer und Angriff.',
    hook_en: 'Kasparov\'s favorite opening! Full of fire and attack.',
    whitePlans_de: [
      'Raumvorteil am Damenfluegel mit c4-c5',
      'Springer von c3 nach d5 - die Festung!',
      'b2-b4-b5 Vormarsch um Linien zu oeffnen',
      'Den Laeufer auf e2 nach d3 umleiten',
    ],
    whitePlans_en: [
      'Space advantage on the queenside with c4-c5',
      'Knight from c3 to d5 - the fortress!',
      'b2-b4-b5 advance to open lines',
      'Reroute the bishop from e2 to d3',
    ],
    blackPlans_de: [
      'Koenigsangriff mit f7-f5-f4!',
      'Dame nach h5, Springer nach f6-h5-f4',
      'Der Laeufer auf g7 ist eine Kanone - Linie oeffnen!',
      'g7-g5-g4 wenn der Angriff ins Rollen kommt',
    ],
    blackPlans_en: [
      'Kingside attack with f7-f5-f4!',
      'Queen to h5, Knight from f6-h5-f4',
      'The bishop on g7 is a cannon - open the diagonal!',
      'g7-g5-g4 when the attack gets rolling',
    ],
    keyIdeas_de: [
      'Beide Seiten greifen auf verschiedenen Seiten an - ein Wettlauf!',
      'Schwarz braucht den Laeufer auf g7 - niemals tauschen!',
      'Das Bauernopfer f5-f4 oeffnet oft entscheidende Linien',
    ],
    keyIdeas_en: [
      'Both sides attack on opposite sides - a race!',
      'Black needs the bishop on g7 - never trade it!',
      'The pawn sacrifice f5-f4 often opens decisive lines',
    ],
    structure: 'kings-indian',
  },

  // === LONDON SYSTEM ===
  {
    eco: 'D00',
    opening: 'London System / Londoner System',
    hook_de: 'Eine Eroeffnung die man gegen ALLES spielen kann - einfach und stark!',
    hook_en: 'An opening you can play against EVERYTHING - simple and strong!',
    whitePlans_de: [
      'Laeufer auf f4, Springer auf f3, Bauern auf d4 und e3 - fertig!',
      'Koenigsangriff: h2-h4-h5 wenn Schwarz kurz rochiert',
      'Springer von d2 nach e5 - ein super Vorposten',
      'Springermaneover: Sd2-f1-e3-g4 oder f5',
    ],
    whitePlans_en: [
      'Bishop on f4, Knight on f3, Pawns on d4 and e3 - done!',
      'Kingside attack: h2-h4-h5 if Black castles short',
      'Knight from d2 to e5 - a great outpost',
      'Knight maneuver: Nd2-f1-e3-g4 or f5',
    ],
    blackPlans_de: [
      'Schnell c5 spielen um das Zentrum herauszufordern',
      'Laeufer nach f5 BEVOR Weiss Ld3 spielt',
      'Damenfluegel-Expansion mit b5 und a5',
      'Den Laeufer auf f4 durch Sh5 angreifen',
    ],
    blackPlans_en: [
      'Play c5 quickly to challenge the center',
      'Bishop to f5 BEFORE White plays Bd3',
      'Queenside expansion with b5 and a5',
      'Attack the bishop on f4 with Nh5',
    ],
    keyIdeas_de: [
      'Das Londoner System ist leicht zu lernen aber schwer zu knacken',
      'Immer die gleiche Aufstellung: Lf4, Sf3, e3, d4, c3',
      'Angriff kommt erst wenn alle Figuren gut stehen',
    ],
    keyIdeas_en: [
      'The London System is easy to learn but hard to crack',
      'Always the same setup: Bf4, Nf3, e3, d4, c3',
      'Attack comes only when all pieces are well placed',
    ],
    structure: 'london',
  },

  // === CARO-KANN ===
  {
    eco: 'B10',
    opening: 'Caro-Kann Defense / Caro-Kann Verteidigung',
    hook_de: 'Die solideste Verteidigung gegen 1.e4 - fast unzerstoerbar!',
    hook_en: 'The most solid defense against 1.e4 - almost indestructible!',
    whitePlans_de: [
      'Raumvorteil mit e4-e5 und Koenigsangriff',
      'Springer nach d6 als Vorposten wenn moeglich',
      'h-Bauer Angriff: h4-h5 gegen die Bauernstruktur',
      'Figuren aktiv aufstellen: Sf3, Ld3, 0-0, Te1',
    ],
    whitePlans_en: [
      'Space advantage with e4-e5 and kingside attack',
      'Knight on d6 as outpost if possible',
      'h-pawn attack: h4-h5 against the pawn structure',
      'Active piece placement: Nf3, Bd3, 0-0, Re1',
    ],
    blackPlans_de: [
      'Laeufer RAUS nach f5 oder g4 - das ist der grosse Vorteil!',
      'Solide Stellung mit c6, d5, Sd7, Sf6',
      'Gegenspiel mit c6-c5 im richtigen Moment',
      'Die Endspiele sind oft gut fuer Schwarz',
    ],
    blackPlans_en: [
      'Bishop OUT to f5 or g4 - this is the big advantage!',
      'Solid position with c6, d5, Nd7, Nf6',
      'Counterplay with c6-c5 at the right moment',
      'Endgames are often good for Black',
    ],
    keyIdeas_de: [
      'Der Unterschied zur Franzoesischen: Der Laeufer kommt RAUS!',
      'Caro-Kann ist super fuer geduldige Spieler',
      'Einfache Entwicklung aber man muss den Moment fuer c5 finden',
    ],
    keyIdeas_en: [
      'The difference to the French: The bishop gets OUT!',
      'Caro-Kann is great for patient players',
      'Simple development but you must find the moment for c5',
    ],
    structure: 'caro-kann',
  },

  // === SCOTCH GAME ===
  {
    eco: 'C45',
    opening: 'Scotch Game / Schottische Partie',
    hook_de: 'Kasparov brachte diese Eroeffnung zurueck! Offen und taktisch.',
    hook_en: 'Kasparov brought this opening back! Open and tactical.',
    whitePlans_de: [
      'Schnelle Entwicklung nach dem fruehen d4',
      'Springer auf c3 und Laeufer auf c4 - klassisch!',
      'Dame auf e2 oder f3 fuer Druck auf das Zentrum',
      'Koenigsangriff sobald die Figuren entwickelt sind',
    ],
    whitePlans_en: [
      'Fast development after the early d4',
      'Knight on c3 and bishop on c4 - classical!',
      'Queen on e2 or f3 for central pressure',
      'Kingside attack as soon as pieces are developed',
    ],
    blackPlans_de: [
      'Nach Sxd4 Dxd4: Dame schnell in Sicherheit bringen',
      'Figuren aktiv entwickeln: Sf6, Lc5, 0-0',
      'd7-d5 Gegenstoss im Zentrum',
      'Die offene Stellung nutzen fuer Taktik!',
    ],
    blackPlans_en: [
      'After Nxd4 Qxd4: get the queen to safety quickly',
      'Active development: Nf6, Bc5, 0-0',
      'd7-d5 counter-thrust in the center',
      'Use the open position for tactics!',
    ],
    keyIdeas_de: [
      'Das offene Zentrum bedeutet: Taktik ist ueberall!',
      'Entwicklung ist hier besonders wichtig',
      'Wer zurueckliegt in der Entwicklung wird bestraft',
    ],
    keyIdeas_en: [
      'The open center means: tactics are everywhere!',
      'Development is especially important here',
      'Whoever falls behind in development gets punished',
    ],
    structure: 'open-center',
  },

  // === PIRC/MODERN ===
  {
    eco: 'B07',
    opening: 'Pirc Defense / Pirc-Verteidigung',
    hook_de: 'Lass Weiss das Zentrum bauen - und dann zerstoere es!',
    hook_en: 'Let White build the center - then destroy it!',
    whitePlans_de: [
      'Grosses Zentrum mit e4 und d4 aufbauen',
      'f3 und Le3 fuer den Oesterreichischen Angriff',
      'Koenigsangriff mit f4-f5 oder h4-h5',
      'Figuren hinter den Zentrumsbauern aktivieren',
    ],
    whitePlans_en: [
      'Build a big center with e4 and d4',
      'f3 and Be3 for the Austrian Attack',
      'Kingside attack with f4-f5 or h4-h5',
      'Activate pieces behind the central pawns',
    ],
    blackPlans_de: [
      'Laeufer auf g7 - die Hauptwaffe!',
      'c7-c5 oder e7-e5 um das Zentrum anzugreifen',
      'Springer auf c6 fuer Druck auf d4',
      'Geduldig warten bis Weiss ueberdehnt',
    ],
    blackPlans_en: [
      'Bishop on g7 - the main weapon!',
      'c7-c5 or e7-e5 to attack the center',
      'Knight on c6 for pressure on d4',
      'Wait patiently until White overextends',
    ],
    keyIdeas_de: [
      'Hyper-modern: erst den Gegner bauen lassen, dann angreifen',
      'Der Laeufer auf g7 kontrolliert die lange Diagonale',
      'Timing ist alles - zu frueh c5/e5 kann schlecht sein',
    ],
    keyIdeas_en: [
      'Hypermodern: let the opponent build, then attack',
      'The bishop on g7 controls the long diagonal',
      'Timing is everything - too early c5/e5 can be bad',
    ],
    structure: 'pirc',
  },

  // === NIMZO-INDIAN ===
  {
    eco: 'E20',
    opening: 'Nimzo-Indian Defense / Nimzoindische Verteidigung',
    hook_de: 'Die eleganteste Verteidigung gegen 1.d4 - Nimzowitschs Meisterwerk!',
    hook_en: 'The most elegant defense against 1.d4 - Nimzowitsch\'s masterpiece!',
    whitePlans_de: [
      'Das Laeuferpaar bekommen durch Lc1-g5 oder a3 Lb4xc3',
      'e3-e4 Vorstoss fuer Zentrumsuebergewicht',
      'Damenfluegelangriff mit a3, b4, c5',
      'Springer von c3 nach e2 wenn der Laeufer c3 verdoppelt',
    ],
    whitePlans_en: [
      'Get the bishop pair via Bc1-g5 or a3 Bb4xc3',
      'e3-e4 push for central superiority',
      'Queenside attack with a3, b4, c5',
      'Knight from c3 to e2 if the bishop doubles on c3',
    ],
    blackPlans_de: [
      'Laeufer auf b4 fesselt den Springer - super Druck!',
      'Verdoppelte Bauern auf c3 sind Schwaechen fuer Weiss',
      'e6-e5 oder c7-c5 Befreiungsschlag',
      'Springer nach e4 als starker Vorposten',
    ],
    blackPlans_en: [
      'Bishop on b4 pins the knight - great pressure!',
      'Doubled pawns on c3 are weaknesses for White',
      'e6-e5 or c7-c5 freeing break',
      'Knight on e4 as a strong outpost',
    ],
    keyIdeas_de: [
      'Es geht um die Kontrolle von e4!',
      'Verdoppelte Bauern koennen stark oder schwach sein - kommt drauf an!',
      'Flexibilitaet: Schwarz kann am Koenigs- oder Damenfluegel spielen',
    ],
    keyIdeas_en: [
      'It\'s all about control of e4!',
      'Doubled pawns can be strong or weak - it depends!',
      'Flexibility: Black can play on the kingside or queenside',
    ],
    structure: 'nimzo-indian',
  },
];

/**
 * Find plans matching an ECO code.
 * Matches on prefix: "C50" matches "C50", "C54" matches "C50" (Italian family), etc.
 */
export function findPlansForEco(eco: string): MiddlegamePlan | null {
  if (!eco) return null;
  // Try exact match first
  const exact = openingPlans.find((p) => p.eco === eco);
  if (exact) return exact;
  // Try prefix match (e.g., C54 -> C50, B90 -> B20 for Sicilian)
  const prefix = eco.slice(0, 2);
  const num = parseInt(eco.slice(1), 10);

  for (const plan of openingPlans) {
    const planPrefix = plan.eco.slice(0, 2);
    const planNum = parseInt(plan.eco.slice(1), 10);
    if (prefix[0] === planPrefix[0] && num >= planNum && num < planNum + 20) {
      return plan;
    }
  }

  return null;
}

/**
 * Find plans based on opening name (fuzzy match).
 */
export function findPlansByName(name: string): MiddlegamePlan | null {
  if (!name) return null;
  const lower = name.toLowerCase();
  return (
    openingPlans.find((p) => lower.includes(p.opening.toLowerCase())) ||
    openingPlans.find((p) =>
      p.opening
        .toLowerCase()
        .split(/[\s/]+/)
        .some((word) => word.length > 3 && lower.includes(word))
    ) ||
    null
  );
}
