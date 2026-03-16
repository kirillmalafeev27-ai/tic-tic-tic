import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';

// 7 columns: wenn, wann, als, wenn, wann, als, wenn
const COLUMN_ANSWERS = ['wenn', 'wann', 'als', 'wenn', 'wann', 'als', 'wenn'];

const ALL_SENTENCES = [
  // wenn (21)
  { id: 'wenn-1', sentence: '___ du Hunger hast, können wir essen gehen.', answer: 'wenn', translation: 'Если ты голоден, мы можем пойти поесть.' },
  { id: 'wenn-2', sentence: '___ es regnet, nehme ich einen Regenschirm.', answer: 'wenn', translation: 'Когда идёт дождь, я беру зонт.' },
  { id: 'wenn-3', sentence: '___ du möchtest, kann ich dir helfen.', answer: 'wenn', translation: 'Если хочешь, я могу тебе помочь.' },
  { id: 'wenn-4', sentence: 'Ruf mich an, ___ du am Bahnhof ankommst.', answer: 'wenn', translation: 'Позвони мне, когда приедешь на вокзал.' },
  { id: 'wenn-5', sentence: '___ ich müde bin, trinke ich Kaffee.', answer: 'wenn', translation: 'Когда я устаю, я пью кофе.' },
  { id: 'wenn-6', sentence: '___ das Wetter schön ist, gehen wir spazieren.', answer: 'wenn', translation: 'Когда погода хорошая, мы гуляем.' },
  { id: 'wenn-7', sentence: 'Ich freue mich, ___ du mich besuchst.', answer: 'wenn', translation: 'Я рад, когда ты меня навещаешь.' },
  { id: 'wenn-8', sentence: '___ man viel lernt, besteht man die Prüfung.', answer: 'wenn', translation: 'Если много учиться, сдашь экзамен.' },
  { id: 'wenn-9', sentence: '___ du Zeit hast, komm vorbei!', answer: 'wenn', translation: 'Если у тебя есть время, заходи!' },
  { id: 'wenn-10', sentence: 'Ich werde traurig, ___ ich allein bin.', answer: 'wenn', translation: 'Мне грустно, когда я один.' },
  { id: 'wenn-11', sentence: '___ ich Kopfschmerzen habe, nehme ich eine Tablette.', answer: 'wenn', translation: 'Когда у меня болит голова, я принимаю таблетку.' },
  { id: 'wenn-12', sentence: '___ du fertig bist, sag mir Bescheid.', answer: 'wenn', translation: 'Когда будешь готов, дай мне знать.' },
  { id: 'wenn-13', sentence: 'Ich gehe immer joggen, ___ die Sonne scheint.', answer: 'wenn', translation: 'Я всегда бегаю, когда светит солнце.' },
  { id: 'wenn-14', sentence: '___ er nicht kommt, fangen wir ohne ihn an.', answer: 'wenn', translation: 'Если он не придёт, начнём без него.' },
  { id: 'wenn-15', sentence: 'Ich koche immer Suppe, ___ es kalt ist.', answer: 'wenn', translation: 'Я всегда варю суп, когда холодно.' },
  { id: 'wenn-16', sentence: '___ du Fragen hast, kannst du mich fragen.', answer: 'wenn', translation: 'Если у тебя есть вопросы, можешь спросить.' },
  { id: 'wenn-17', sentence: 'Er wird böse, ___ man ihn stört.', answer: 'wenn', translation: 'Он злится, когда его беспокоят.' },
  { id: 'wenn-18', sentence: '___ ich Musik höre, kann ich mich konzentrieren.', answer: 'wenn', translation: 'Когда я слушаю музыку, я могу сосредоточиться.' },
  { id: 'wenn-19', sentence: '___ wir uns sehen, reden wir immer viel.', answer: 'wenn', translation: 'Когда мы видимся, мы всегда много разговариваем.' },
  { id: 'wenn-20', sentence: 'Ich sage dir Bescheid, ___ ich es weiß.', answer: 'wenn', translation: 'Я дам тебе знать, когда узнаю.' },
  { id: 'wenn-21', sentence: '___ du willst, können wir ins Kino gehen.', answer: 'wenn', translation: 'Если хочешь, мы можем пойти в кино.' },

  // als (14)
  { id: 'als-1', sentence: '___ ich ein Kind war, hatte ich einen Hund.', answer: 'als', translation: 'Когда я был ребёнком, у меня была собака.' },
  { id: 'als-2', sentence: '___ er nach Berlin kam, hat er sofort Arbeit gefunden.', answer: 'als', translation: 'Когда он приехал в Берлин, он сразу нашёл работу.' },
  { id: 'als-3', sentence: '___ wir im Urlaub waren, hat es jeden Tag geregnet.', answer: 'als', translation: 'Когда мы были в отпуске, каждый день шёл дождь.' },
  { id: 'als-4', sentence: '___ ich die Nachricht gehört habe, war ich überrascht.', answer: 'als', translation: 'Когда я услышал новость, я был удивлён.' },
  { id: 'als-5', sentence: '___ sie 18 wurde, hat sie den Führerschein gemacht.', answer: 'als', translation: 'Когда ей исполнилось 18, она получила водительские права.' },
  { id: 'als-6', sentence: '___ der Lehrer den Raum betrat, wurden alle still.', answer: 'als', translation: 'Когда учитель вошёл в комнату, все замолчали.' },
  { id: 'als-7', sentence: '___ ich zum ersten Mal geflogen bin, hatte ich Angst.', answer: 'als', translation: 'Когда я впервые летел на самолёте, мне было страшно.' },
  { id: 'als-8', sentence: '___ wir ankamen, war das Restaurant schon geschlossen.', answer: 'als', translation: 'Когда мы приехали, ресторан был уже закрыт.' },
  { id: 'als-9', sentence: '___ ich gestern nach Hause kam, hat es geschneit.', answer: 'als', translation: 'Когда я вчера пришёл домой, шёл снег.' },
  { id: 'als-10', sentence: '___ er das Buch las, schlief er ein.', answer: 'als', translation: 'Когда он читал книгу, он заснул.' },
  { id: 'als-11', sentence: '___ ich in der Schule war, mochte ich Mathe nicht.', answer: 'als', translation: 'Когда я учился в школе, я не любил математику.' },
  { id: 'als-12', sentence: '___ wir uns zum ersten Mal trafen, war es Sommer.', answer: 'als', translation: 'Когда мы впервые встретились, было лето.' },
  { id: 'als-13', sentence: '___ ich aufwachte, war es schon 10 Uhr.', answer: 'als', translation: 'Когда я проснулся, было уже 10 часов.' },
  { id: 'als-14', sentence: '___ sie anrief, war ich nicht zu Hause.', answer: 'als', translation: 'Когда она позвонила, меня не было дома.' },

  // wann (14) — note: sentence includes "13" which has duplicate with wenn, using unique phrasing
  { id: 'wann-1', sentence: '___ fährt der nächste Zug?', answer: 'wann', translation: 'Когда отправляется следующий поезд?' },
  { id: 'wann-2', sentence: '___ hast du Geburtstag?', answer: 'wann', translation: 'Когда у тебя день рождения?' },
  { id: 'wann-3', sentence: 'Weißt du, ___ der Film beginnt?', answer: 'wann', translation: 'Ты знаешь, когда начинается фильм?' },
  { id: 'wann-4', sentence: '___ kommst du nach Hause?', answer: 'wann', translation: 'Когда ты придёшь домой?' },
  { id: 'wann-5', sentence: 'Ich weiß nicht, ___ er zurückkommt.', answer: 'wann', translation: 'Я не знаю, когда он вернётся.' },
  { id: 'wann-6', sentence: '___ hast du das letzte Mal Sport gemacht?', answer: 'wann', translation: 'Когда ты последний раз занимался спортом?' },
  { id: 'wann-7', sentence: 'Kannst du mir sagen, ___ der Kurs anfängt?', answer: 'wann', translation: 'Можешь сказать, когда начинается курс?' },
  { id: 'wann-8', sentence: '___ ist das Konzert?', answer: 'wann', translation: 'Когда концерт?' },
  { id: 'wann-9', sentence: 'Er hat gefragt, ___ wir fertig sind.', answer: 'wann', translation: 'Он спросил, когда мы будем готовы.' },
  { id: 'wann-10', sentence: '___ fängt die Schule an?', answer: 'wann', translation: 'Когда начинается школа?' },
  { id: 'wann-11', sentence: 'Ich frage mich, ___ das Paket kommt.', answer: 'wann', translation: 'Я спрашиваю себя, когда придёт посылка.' },
  { id: 'wann-12', sentence: '___ war sie das letzte Mal hier?', answer: 'wann', translation: 'Когда она была здесь в последний раз?' },
  { id: 'wann-13', sentence: 'Sag mir, ___ du Zeit hast.', answer: 'wann', translation: 'Скажи мне, когда у тебя есть время.' },
  { id: 'wann-14', sentence: '___ hast du das gelernt?', answer: 'wann', translation: 'Когда ты это выучил?' },
];

const ANSWER_COLORS = {
  'wenn': 'from-amber-400 to-orange-500',
  'wann': 'from-sky-400 to-blue-500',
  'als': 'from-violet-400 to-purple-500',
};

const ANSWER_LABEL_COLORS = {
  'wenn': 'text-amber-400',
  'wann': 'text-sky-400',
  'als': 'text-violet-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const WennWannAlsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('menu');
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState(new Set());
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [usedSentences, setUsedSentences] = useState(new Set());
  const [lastResult, setLastResult] = useState(null);
  const [sentences, setSentences] = useState([]);
  const boardRef = useRef(null);

  const shuffleSentences = () => {
    return [...ALL_SENTENCES].sort(() => Math.random() - 0.5);
  };

  const checkWinner = (board, row, col) => {
    const player = board[row][col];
    if (!player) return null;

    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]]
    ];

    for (const [dir1, dir2] of directions) {
      const cells = [[row, col]];
      for (const [dr, dc] of [dir1, dir2]) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
          cells.push([r, c]);
          r += dr;
          c += dc;
        }
      }
      if (cells.length >= 4) {
        setWinningCells(cells);
        return player;
      }
    }
    return null;
  };

  const isBoardFull = (board) => board[0].every(cell => cell !== null);

  const getAvailableRow = (board, col) => {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === null) return row;
    }
    return -1;
  };

  const handleColumnClick = (col) => {
    if (gameState !== 'playing' || !selectedSentence) return;

    const row = getAvailableRow(board, col);
    if (row === -1) return;

    const columnAnswer = COLUMN_ANSWERS[col];
    const correctAnswer = selectedSentence.answer;
    const isCorrect = correctAnswer === columnAnswer;

    const pieceOwner = isCorrect ? currentPlayer : (currentPlayer === 'player1' ? 'player2' : 'player1');

    const pieceId = `${row}-${col}`;
    setAnimatingPieces(prev => new Set(prev).add(pieceId));

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = pieceOwner;
    setBoard(newBoard);
    setLastMove({ row, col });

    setUsedSentences(prev => new Set(prev).add(selectedSentence.id));

    setLastResult({
      correct: isCorrect,
      sentence: selectedSentence,
      column: col,
      actualAnswer: correctAnswer,
      columnAnswer: columnAnswer,
      player: currentPlayer,
    });

    setSelectedSentence(null);

    setTimeout(() => {
      setAnimatingPieces(prev => {
        const next = new Set(prev);
        next.delete(pieceId);
        return next;
      });
    }, 300);

    const w = checkWinner(newBoard, row, col);
    if (w) {
      setWinner(w);
      setGameState('gameOver');
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setGameState('gameOver');
      return;
    }

    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const startGame = () => {
    setGameState('playing');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedSentence(null);
    setUsedSentences(new Set());
    setLastResult(null);
    setSentences(shuffleSentences());
  };

  const resetGame = () => {
    setGameState('menu');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedSentence(null);
    setUsedSentences(new Set());
    setLastResult(null);
    setSentences([]);
  };

  const availableSentences = sentences.filter(s => !usedSentences.has(s.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Menu */}
      {gameState === 'menu' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg w-full">
            {onBack && (
              <button onClick={onBack} className="text-gray-400 hover:text-white text-sm mb-4 transition-colors">
                ← Zurück zum Menü
              </button>
            )}
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              wenn / wann / als
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">Temporale Nebensätze</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Lerne den Unterschied zwischen wenn, wann und als!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">wenn</span>
                <span>= Bedingung / wiederholte Handlung (Gegenwart, Zukunft)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-violet-400 font-bold shrink-0">als</span>
                <span>= einmaliges Ereignis in der Vergangenheit</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sky-400 font-bold shrink-0">wann</span>
                <span>= Fragewort (direkte und indirekte Fragen)</span>
              </div>
              <div className="border-t border-white/10 pt-3 mt-3">
                <p>Wähle einen Satz und setze ihn in die Spalte mit dem richtigen Wort!</p>
                <p>Richtig = deine Farbe. Falsch = Farbe des Gegners!</p>
                <p>4 in einer Reihe gewinnt!</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-pink-500"></div>
                  <span className="text-gray-300">Spieler 1</span>
                </div>
                <span className="text-gray-500">vs</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                  <span className="text-gray-300">Spieler 2</span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Users className="w-5 h-5" />
                <span>Spiel starten</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game */}
      {(gameState === 'playing' || gameState === 'gameOver') && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="flex gap-6 max-w-7xl w-full items-start">
            {/* Game Board */}
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {onBack && (
                      <button onClick={() => { resetGame(); onBack(); }} className="text-gray-400 hover:text-white text-xs mb-1 transition-colors block">
                        ← Zurück
                      </button>
                    )}
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                      wenn / wann / als
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      currentPlayer === 'player1'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      <User className="inline w-4 h-4 mr-1" />
                      Spieler 1
                    </div>
                    <div className={`px-3 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      currentPlayer === 'player2'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      <User className="inline w-4 h-4 mr-1" />
                      Spieler 2
                    </div>
                  </div>
                </div>

                {/* Selected sentence indicator */}
                {gameState === 'playing' && (
                  <div className="mb-3 text-center">
                    {selectedSentence ? (
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2 flex-wrap justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedSentence.sentence.split('___').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && <span className="text-yellow-300 font-bold mx-1">___</span>}
                            </React.Fragment>
                          ))}
                        </span>
                        <span className="text-gray-400 text-sm ml-2">→ Wähle eine Spalte!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                        <span className="text-gray-500 text-sm">← Wähle zuerst einen Satz aus der Liste</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Result feedback */}
                {lastResult && (
                  <div className={`mb-3 text-center transition-all duration-500 ${
                    lastResult.correct ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                      lastResult.correct ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {lastResult.correct ? (
                        <span>Richtig! <strong>{lastResult.actualAnswer}</strong></span>
                      ) : (
                        <span>Falsch! Richtig wäre <strong>{lastResult.actualAnswer}</strong>, nicht {lastResult.columnAnswer}. Punkt für den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column answer labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_ANSWERS.map((answer, col) => (
                    <div key={col} className={`text-center font-bold text-sm ${ANSWER_LABEL_COLORS[answer]}`}>
                      {answer}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-amber-900/40 rounded-2xl p-4 shadow-inner">
                  <div className="grid grid-cols-7 gap-2">
                    {Array(7).fill().map((_, col) => (
                      <div
                        key={col}
                        className={`relative ${selectedSentence ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => handleColumnClick(col)}
                        onMouseEnter={() => setHoveredCol(col)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {hoveredCol === col && selectedSentence && gameState === 'playing' && (
                          <div className="absolute top-0 left-0 right-0 h-full bg-white/5 rounded-lg pointer-events-none" />
                        )}

                        {board.map((row, rowIndex) => {
                          const isWinning = winningCells.some(([r, c]) => r === rowIndex && c === col);
                          const isLastMove = lastMove?.row === rowIndex && lastMove?.col === col;
                          const isAnimating = animatingPieces.has(`${rowIndex}-${col}`);

                          return (
                            <div
                              key={rowIndex}
                              className={`aspect-square rounded-full border-4 border-amber-800/60 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-amber-950/50' : ''
                              } ${selectedSentence && row[col] === null ? 'hover:bg-amber-900/50' : ''}`}
                            >
                              {row[col] && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${
                                  PLAYER_COLORS[row[col]]
                                } shadow-lg ${
                                  PLAYER_SHADOW[row[col]]
                                } ${isWinning ? 'animate-pulse' : ''} ${
                                  isAnimating ? 'animate-drop' : ''
                                }`} />
                              )}
                              {isLastMove && !isWinning && (
                                <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Game Over */}
                {gameState === 'gameOver' && (
                  <div className="mt-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      {winner === 'draw' ? (
                        <span className="text-gray-300">Unentschieden!</span>
                      ) : winner === 'player1' ? (
                        <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Spieler 1 gewinnt!</span>
                      ) : (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Spieler 2 gewinnt!</span>
                      )}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Nochmal spielen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sentence Panel */}
            <div className="w-96">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold text-white">Sätze</h2>
                  <span className="ml-auto text-sm text-gray-400">
                    {availableSentences.length} übrig
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {sentences.map((sentObj) => {
                    const isUsed = usedSentences.has(sentObj.id);
                    const isSelected = selectedSentence?.id === sentObj.id;

                    return (
                      <button
                        key={sentObj.id}
                        disabled={isUsed || gameState === 'gameOver'}
                        onClick={() => {
                          if (!isUsed && gameState === 'playing') {
                            setSelectedSentence(isSelected ? null : sentObj);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed'
                            : isSelected
                              ? 'bg-amber-500/30 border-2 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`text-sm ${isUsed ? 'line-through' : ''}`}>
                          <span className={`${isSelected ? 'text-amber-200' : 'text-white'}`}>
                            {sentObj.sentence.split('___').map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  isUsed
                                    ? <span className={`font-bold ${ANSWER_LABEL_COLORS[sentObj.answer]}`}>{sentObj.answer}</span>
                                    : <span className="text-yellow-300 font-bold">___</span>
                                )}
                              </React.Fragment>
                            ))}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{sentObj.translation}</div>
                      </button>
                    );
                  })}

                  {availableSentences.length === 0 && gameState === 'playing' && (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Alle Sätze wurden benutzt!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Spalten:</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {COLUMN_ANSWERS.map((answer, i) => (
                      <span key={i} className={`${ANSWER_LABEL_COLORS[answer]} font-bold`}>
                        {i + 1}:{answer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes drop {
          0% { transform: translateY(-600px); }
          100% { transform: translateY(0); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-drop {
          animation: drop 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default WennWannAlsGame;
