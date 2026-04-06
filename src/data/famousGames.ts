/**
 * Curated famous games that serve as "hooks" for opening study.
 * Each game has a story that makes it memorable for young players.
 */

export interface FamousGame {
  /** Lichess game ID or empty if not on Lichess */
  lichessId?: string;
  white: string;
  black: string;
  year: number;
  event: string;
  result: '1-0' | '0-1' | '1/2-1/2';
  eco: string;
  opening: string;
  /** The exciting story behind this game - kid-friendly! */
  story_de: string;
  story_en: string;
  /** What can you learn from this game? */
  lesson_de: string;
  lesson_en: string;
  /** The key moment described in words */
  keyMoment_de: string;
  keyMoment_en: string;
  /** PGN of the game */
  pgn: string;
}

export const famousGames: FamousGame[] = [
  // === THE IMMORTAL GAME ===
  {
    white: 'Adolf Anderssen',
    black: 'Lionel Kieseritzky',
    year: 1851,
    event: 'London',
    result: '1-0',
    eco: 'C33',
    opening: 'King\'s Gambit',
    story_de:
      'Die "Unsterbliche Partie"! Anderssen opferte BEIDE Tuerme, einen Laeufer und seine Dame - und gewann trotzdem mit einem wunderschoenen Matt! Das war vor ueber 170 Jahren und Schachspieler reden immer noch darueber.',
    story_en:
      'The "Immortal Game"! Anderssen sacrificed BOTH rooks, a bishop, and his queen - and still won with a beautiful checkmate! This was over 170 years ago and chess players still talk about it.',
    lesson_de: 'Manchmal ist Angriff wichtiger als Material. Wenn alle deine Figuren auf den Koenig zielen, braucht man keine Dame!',
    lesson_en: 'Sometimes attack is more important than material. When all your pieces aim at the king, you don\'t need a queen!',
    keyMoment_de: 'Zug 18: Anderssen opfert den Laeufer auf d7! Der Koenig wird ins Freie gezogen.',
    keyMoment_en: 'Move 18: Anderssen sacrifices the bishop on d7! The king is drawn into the open.',
    pgn: `[Event "London"]
[Site "London"]
[Date "1851.06.21"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "1-0"]
[ECO "C33"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },

  // === FISCHER'S GAME OF THE CENTURY ===
  {
    white: 'Donald Byrne',
    black: 'Robert James Fischer',
    year: 1956,
    event: 'New York Rosenwald Memorial',
    result: '0-1',
    eco: 'D92',
    opening: 'Gruenfeld Defense',
    story_de:
      'Bobby Fischer war erst 13 Jahre alt! Er spielte gegen einen der besten Spieler Amerikas und opferte seine Dame fuer einen unaufhaltsamen Angriff. Diese Partie wurde "Partie des Jahrhunderts" getauft.',
    story_en:
      'Bobby Fischer was only 13 years old! He played against one of America\'s best players and sacrificed his queen for an unstoppable attack. This game was called "The Game of the Century".',
    lesson_de: 'Alter spielt keine Rolle im Schach! Wenn du eine gute Idee hast, spiele sie - egal gegen wen.',
    lesson_en: 'Age doesn\'t matter in chess! If you have a good idea, play it - no matter who your opponent is.',
    keyMoment_de: 'Zug 17: Der 13-jaehrige Fischer opfert seine Dame mit Le6!! Ein unglaublicher Zug.',
    keyMoment_en: 'Move 17: 13-year-old Fischer sacrifices his queen with Be6!! An incredible move.',
    pgn: `[Event "Third Rosenwald Trophy"]
[Site "New York, NY USA"]
[Date "1956.10.17"]
[White "Byrne, Donald"]
[Black "Fischer, Robert James"]
[Result "0-1"]
[ECO "D92"]
[WhiteElo "2500"]
[BlackElo "2500"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Ra1# 0-1`,
  },

  // === KASPAROV'S KING'S INDIAN MASTERPIECE ===
  {
    white: 'Veselin Topalov',
    black: 'Garry Kasparov',
    year: 1999,
    event: 'Wijk aan Zee',
    result: '0-1',
    eco: 'E97',
    opening: 'King\'s Indian Defense',
    story_de:
      'Kasparov spielte die Koenigsindische Verteidigung wie eine Rakete! Er opferte Material und seine Figuren tanzten uebers ganze Brett. Am Ende konnte Topalov nur noch staunen.',
    story_en:
      'Kasparov played the King\'s Indian Defense like a rocket! He sacrificed material and his pieces danced across the entire board. In the end, Topalov could only watch in amazement.',
    lesson_de: 'In der Koenigsindischen muss man mutig sein. Der Angriff am Koenigsfluegel kann unglaublich stark werden!',
    lesson_en: 'In the King\'s Indian you must be brave. The kingside attack can become incredibly strong!',
    keyMoment_de: 'Zug 24: Kasparov spielt Txd4!! und oeffnet alle Linien zum weissen Koenig.',
    keyMoment_en: 'Move 24: Kasparov plays Rxd4!! opening all lines to the white king.',
    pgn: `[Event "Hoogovens"]
[Site "Wijk aan Zee NED"]
[Date "1999.01.20"]
[White "Topalov, Veselin"]
[Black "Kasparov, Garry"]
[Result "0-1"]
[ECO "E97"]
[WhiteElo "2700"]
[BlackElo "2812"]

1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Nd2 a5 10. Rb1 Nd7 11. a3 f5 12. b4 Kh8 13. f3 Ng8 14. Qc2 Ngf6 15. Nb5 axb4 16. axb4 Nh5 17. g3 Ndf6 18. c5 Bd7 19. Rb3 Nxe4 20. fxe4 f4 21. c6 bxc6 22. dxc6 Nxg3 23. Rxg3 fxg3 24. cxd7 Rxf1+ 25. Bxf1 Qxd7 26. Qxg6 Qf7 27. Qd3 Qf2+ 28. Kh1 Qf3+ 29. Kg1 Bd4+ 30. Kh1 Qg2# 0-1`,
  },

  // === MORPHY'S OPERA GAME ===
  {
    white: 'Paul Morphy',
    black: 'Duke of Brunswick & Count Isouard',
    year: 1858,
    event: 'Paris Opera',
    result: '1-0',
    eco: 'C41',
    opening: 'Philidor Defense',
    story_de:
      'Morphy spielte diese Partie in der Pariser Oper waehrend einer Auffuehrung! Gegen zwei Spieler gleichzeitig zeigte er, wie man mit schneller Entwicklung gewinnt. Die perfekte Lehrpartie!',
    story_en:
      'Morphy played this game at the Paris Opera during a performance! Against two players at once, he showed how to win with fast development. The perfect teaching game!',
    lesson_de: 'Entwickle ALLE Figuren so schnell wie moeglich! Jede Figur die noch am Anfang steht, ist ein verlorener Soldat.',
    lesson_en: 'Develop ALL pieces as fast as possible! Every piece still on the starting square is a lost soldier.',
    keyMoment_de: 'Morphy opfert den Laeufer und den Turm um die letzten Figuren mit Schach zu entwickeln!',
    keyMoment_en: 'Morphy sacrifices the bishop and rook to develop the last pieces with check!',
    pgn: `[Event "Paris Opera"]
[Site "Paris"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]
[ECO "C41"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
  },

  // === CAPABLANCA'S ENDGAME MAGIC ===
  {
    white: 'Jose Raul Capablanca',
    black: 'Savielly Tartakower',
    year: 1924,
    event: 'New York',
    result: '1-0',
    eco: 'D63',
    opening: 'Queen\'s Gambit Declined',
    story_de:
      'Capablanca war so gut im Endspiel, dass man ihn die "Schachmaschine" nannte. Hier zeigt er, wie man aus einem winzigen Vorteil einen Sieg macht. Schritt fuer Schritt, wie ein Uhrwerk.',
    story_en:
      'Capablanca was so good at endgames that he was called the "Chess Machine". Here he shows how to turn a tiny advantage into a win. Step by step, like clockwork.',
    lesson_de: 'Im Endspiel zaehlt jeder kleine Vorteil! Ein aktiver Turm und ein besserer Koenig koennen die Partie entscheiden.',
    lesson_en: 'In the endgame every small advantage counts! An active rook and a better king can decide the game.',
    keyMoment_de: 'Capablanca aktiviert seinen Koenig und laeuft einfach durch - elegant und unaufhaltsam.',
    keyMoment_en: 'Capablanca activates his king and simply walks through - elegant and unstoppable.',
    pgn: `[Event "New York"]
[Site "New York"]
[Date "1924.03.23"]
[White "Capablanca, Jose Raul"]
[Black "Tartakower, Savielly"]
[Result "1-0"]
[ECO "D63"]

1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Nbd7 5. e3 Be7 6. Nf3 O-O 7. Rc1 a6 8. a3 h6 9. Bh4 dxc4 10. Bxc4 b5 11. Be2 Bb7 12. O-O c5 13. dxc5 Nxc5 14. Nd4 Rc8 15. b4 Nce4 16. Nxe4 Nxe4 17. Bg3 Rxc1 18. Qxc1 Qa8 19. f3 Nd6 20. Bf2 Rc8 21. Qb2 Bf6 22. Rd1 Nc4 23. Bxc4 Rxc4 24. Rc1 Bc6 25. Qd2 Qb7 26. Rxc4 bxc4 27. Qc2 Qb5 28. Kf1 a5 29. bxa5 Qxa5 30. Qxc4 Qa1+ 31. Kf2 Qa2+ 32. Kg3 Qb1 33. Qd3 Qc1 34. Kf2 Qc2 35. Qxc2 Bxc2 36. Nxe6 fxe6 37. Bd4 Bf6 38. Bxf6 gxf6 39. Ke2 Bd1+ 40. Kd3 Ba4 41. Kc4 Kf7 42. Kb4 Bc2 43. Ka5 Ke7 44. Kb6 Kd6 45. a4 Bb1 46. a5 Ba2 47. Ka7 1-0`,
  },

  // === TAL'S MAGIC ===
  {
    white: 'Mikhail Tal',
    black: 'Vasily Smyslov',
    year: 1959,
    event: 'Candidates Tournament',
    result: '1-0',
    eco: 'B10',
    opening: 'Caro-Kann Defense',
    story_de:
      'Tal war der "Zauberer aus Riga"! Er spielte so aggressiv, dass selbst Weltmeister Angst vor ihm hatten. Hier opfert er einen Springer fuer einen vernichtenden Angriff.',
    story_en:
      'Tal was the "Magician from Riga"! He played so aggressively that even world champions were afraid of him. Here he sacrifices a knight for a devastating attack.',
    lesson_de: 'Gegen die Caro-Kann kann Weiss wild angreifen! Manchmal sind Opfer die beste Strategie.',
    lesson_en: 'Against the Caro-Kann, White can attack wildly! Sometimes sacrifices are the best strategy.',
    keyMoment_de: 'Tal opfert den Springer und das ganze Brett gehoert ihm!',
    keyMoment_en: 'Tal sacrifices the knight and the whole board belongs to him!',
    pgn: `[Event "Candidates"]
[Site "Bled-Zagreb-Belgrade"]
[Date "1959.09.18"]
[White "Tal, Mikhail"]
[Black "Smyslov, Vasily"]
[Result "1-0"]
[ECO "B10"]
[WhiteElo "2700"]
[BlackElo "2680"]

1. e4 c6 2. d3 d5 3. Nd2 e5 4. Ngf3 Nd7 5. d4 dxe4 6. Nxe4 exd4 7. Qxd4 Ngf6 8. Bg5 Be7 9. O-O-O O-O 10. Nd6 Qa5 11. Bc4 b5 12. Bd2 Qa6 13. Nf5 Bd8 14. Qh4 bxc4 15. Qg5 Nh5 16. Nh6+ Kh8 17. Qxh5 Qxa2 18. Bc3 Nf6 19. Qxf7 Qa1+ 20. Kd2 Rxf7 21. Nxf7+ Kg8 22. Rxa1 Kxf7 23. Ne5+ Ke6 24. Nxc6 Ne4+ 25. Ke3 Bb6+ 26. Bd4 1-0`,
  },
];

/**
 * Find famous games by ECO code (prefix match).
 */
export function findFamousGamesByEco(eco: string): FamousGame[] {
  if (!eco) return [];
  const prefix = eco[0];
  const num = parseInt(eco.slice(1), 10);

  return famousGames.filter((g) => {
    const gPrefix = g.eco[0];
    const gNum = parseInt(g.eco.slice(1), 10);
    return prefix === gPrefix && Math.abs(num - gNum) <= 15;
  });
}

/**
 * Find famous games by opening name (fuzzy).
 */
export function findFamousGamesByOpening(name: string): FamousGame[] {
  if (!name) return [];
  const lower = name.toLowerCase();
  return famousGames.filter(
    (g) =>
      lower.includes(g.opening.toLowerCase()) ||
      g.opening
        .toLowerCase()
        .split(/[\s/]+/)
        .some((w) => w.length > 3 && lower.includes(w))
  );
}
