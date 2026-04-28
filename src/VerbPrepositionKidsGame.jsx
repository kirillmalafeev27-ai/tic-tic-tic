import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';
import CursorGlow from './CursorGlow';

const COLUMN_PREPOSITIONS = ['an', 'über', 'von', 'für', 'mit', 'auf', 'nach'];

// Simple, kid-friendly verbs (age 9). 4 per preposition = 28 total.
// Translations in Russian, plus a short example sentence for context.
const ALL_VERBS = [
  // an
  { verb: 'denken', preposition: 'an', translation: 'думать о', example: 'Ich denke an Mama.' },
  { verb: 'schreiben', preposition: 'an', translation: 'писать (кому-то)', example: 'Ich schreibe an Oma.' },
  { verb: 'glauben', preposition: 'an', translation: 'верить в', example: 'Ich glaube an Magie.' },
  { verb: 'sich erinnern', preposition: 'an', translation: 'помнить о', example: 'Ich erinnere mich an den Urlaub.' },

  // über
  { verb: 'lachen', preposition: 'über', translation: 'смеяться над', example: 'Wir lachen über den Witz.' },
  { verb: 'sprechen', preposition: 'über', translation: 'говорить о', example: 'Wir sprechen über die Schule.' },
  { verb: 'nachdenken', preposition: 'über', translation: 'размышлять о', example: 'Ich denke über das Buch nach.' },
  { verb: 'sich freuen', preposition: 'über', translation: 'радоваться (чему-то)', example: 'Ich freue mich über das Geschenk.' },

  // von
  { verb: 'träumen', preposition: 'von', translation: 'мечтать о', example: 'Ich träume von einem Hund.' },
  { verb: 'erzählen', preposition: 'von', translation: 'рассказывать о', example: 'Papa erzählt von der Reise.' },
  { verb: 'kommen', preposition: 'von', translation: 'приходить (откуда-то)', example: 'Ich komme von der Schule.' },
  { verb: 'hören', preposition: 'von', translation: 'слышать о', example: 'Ich höre von dem Film.' },

  // für
  { verb: 'danken', preposition: 'für', translation: 'благодарить за', example: 'Ich danke dir für das Eis.' },
  { verb: 'bezahlen', preposition: 'für', translation: 'платить за', example: 'Mama bezahlt für das Buch.' },
  { verb: 'sorgen', preposition: 'für', translation: 'заботиться о', example: 'Ich sorge für meine Katze.' },
  { verb: 'kämpfen', preposition: 'für', translation: 'бороться за', example: 'Wir kämpfen für die Natur.' },

  // mit
  { verb: 'spielen', preposition: 'mit', translation: 'играть с', example: 'Ich spiele mit dem Hund.' },
  { verb: 'sprechen', preposition: 'mit', translation: 'говорить с', example: 'Ich spreche mit Oma.' },
  { verb: 'anfangen', preposition: 'mit', translation: 'начинать с', example: 'Wir fangen mit Mathe an.' },
  { verb: 'telefonieren', preposition: 'mit', translation: 'звонить (кому-то)', example: 'Ich telefoniere mit Papa.' },

  // auf
  { verb: 'warten', preposition: 'auf', translation: 'ждать', example: 'Ich warte auf den Bus.' },
  { verb: 'antworten', preposition: 'auf', translation: 'отвечать на', example: 'Ich antworte auf die Frage.' },
  { verb: 'aufpassen', preposition: 'auf', translation: 'присматривать за', example: 'Ich passe auf meinen Bruder auf.' },
  { verb: 'hoffen', preposition: 'auf', translation: 'надеяться на', example: 'Ich hoffe auf gutes Wetter.' },

  // nach
  { verb: 'fragen', preposition: 'nach', translation: 'спрашивать о', example: 'Ich frage nach dem Weg.' },
  { verb: 'suchen', preposition: 'nach', translation: 'искать', example: 'Ich suche nach meinem Heft.' },
  { verb: 'riechen', preposition: 'nach', translation: 'пахнуть (чем-то)', example: 'Es riecht nach Pizza.' },
  { verb: 'schmecken', preposition: 'nach', translation: 'быть на вкус', example: 'Es schmeckt nach Schokolade.' },
];

const PREPOSITION_LABEL_COLORS = {
  'an': 'text-blue-400',
  'über': 'text-pink-400',
  'von': 'text-green-400',
  'für': 'text-amber-400',
  'mit': 'text-cyan-400',
  'auf': 'text-violet-400',
  'nach': 'text-rose-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const VerbPrepositionKidsGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('menu');
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState(new Set());
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [usedVerbs, setUsedVerbs] = useState(new Set());
  const [lastResult, setLastResult] = useState(null);
  const [verbs, setVerbs] = useState([]);
  const boardRef = useRef(null);

  const verbKey = (v) => `${v.verb}-${v.preposition}`;

  const shuffleVerbs = () => {
    return [...ALL_VERBS].sort(() => Math.random() - 0.5);
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
    if (gameState !== 'playing' || !selectedVerb) return;

    const row = getAvailableRow(board, col);
    if (row === -1) return;

    const columnPreposition = COLUMN_PREPOSITIONS[col];
    const verbPreposition = selectedVerb.preposition;
    const isCorrect = verbPreposition === columnPreposition;

    const pieceOwner = isCorrect ? currentPlayer : (currentPlayer === 'player1' ? 'player2' : 'player1');

    const pieceId = `${row}-${col}`;
    setAnimatingPieces(prev => new Set(prev).add(pieceId));

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = pieceOwner;
    setBoard(newBoard);
    setLastMove({ row, col });

    setUsedVerbs(prev => new Set(prev).add(verbKey(selectedVerb)));

    setLastResult({
      correct: isCorrect,
      verb: selectedVerb.verb,
      example: selectedVerb.example,
      column: col,
      actualPreposition: verbPreposition,
      columnPreposition: columnPreposition,
      player: currentPlayer,
    });

    setSelectedVerb(null);

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
    setSelectedVerb(null);
    setUsedVerbs(new Set());
    setLastResult(null);
    setVerbs(shuffleVerbs());
  };

  const resetGame = () => {
    setGameState('menu');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedVerb(null);
    setUsedVerbs(new Set());
    setLastResult(null);
    setVerbs([]);
  };

  const availableVerbs = verbs.filter(v => !usedVerbs.has(verbKey(v)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-fuchsia-900 to-amber-900 relative overflow-hidden">
      <CursorGlow colors="#fbbf24, #ec4899, #38bdf8" size={500} blur={180} opacity={0.3} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Menu */}
      {gameState === 'menu' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg w-full">
            {onBack && (
              <button onClick={onBack} className="text-gray-300 hover:text-white text-sm mb-4 transition-colors">
                ← Назад в меню
              </button>
            )}
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-amber-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
              Verb + Präposition
            </h1>
            <p className="text-center text-gray-200 mb-1 text-lg">Глагол + предлог (для детей)</p>
            <p className="text-center text-gray-300 mb-6 text-sm">
              28 простых глаголов · 7 предлогов
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm text-gray-200 space-y-2">
              <p className="font-semibold text-white">Как играть:</p>
              <div className="flex flex-wrap gap-2 my-2">
                {COLUMN_PREPOSITIONS.map(p => (
                  <span key={p} className={`${PREPOSITION_LABEL_COLORS[p]} font-bold px-2 py-1 bg-white/10 rounded`}>{p}</span>
                ))}
              </div>
              <p>1. Выбери глагол слева.</p>
              <p>2. Положи фишку в столбец с правильным предлогом.</p>
              <p>3. Правильно — твой цвет. Ошибся — фишка идёт сопернику!</p>
              <p>4. Собери 4 фишки в ряд и выиграй!</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-pink-500"></div>
                  <span className="text-gray-200">Игрок 1</span>
                </div>
                <span className="text-gray-400">vs</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                  <span className="text-gray-200">Игрок 2</span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 hover:from-amber-500 hover:via-pink-600 hover:to-sky-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Users className="w-5 h-5" />
                <span>Начать игру</span>
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
                      <button onClick={() => { resetGame(); onBack(); }} className="text-gray-300 hover:text-white text-xs mb-1 transition-colors block">
                        ← Назад
                      </button>
                    )}
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
                      Verb + Präposition (Kids)
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      currentPlayer === 'player1'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      <User className="inline w-4 h-4 mr-1" />
                      Игрок 1
                    </div>
                    <div className={`px-3 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      currentPlayer === 'player2'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      <User className="inline w-4 h-4 mr-1" />
                      Игрок 2
                    </div>
                  </div>
                </div>

                {/* Selected verb indicator */}
                {gameState === 'playing' && (
                  <div className="mb-3 text-center">
                    {selectedVerb ? (
                      <div className="inline-flex flex-col items-center gap-1 bg-white/10 rounded-2xl px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">Глагол:</span>
                          <span className="text-white font-bold text-lg">{selectedVerb.verb}</span>
                          <span className="text-gray-300 text-sm">— {selectedVerb.translation}</span>
                        </div>
                        <span className="text-gray-400 text-xs">→ выбери столбец с правильным предлогом!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                        <span className="text-gray-300 text-sm">← сначала выбери глагол справа</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Result feedback */}
                {lastResult && (
                  <div className={`mb-3 text-center transition-all duration-500 ${
                    lastResult.correct ? 'text-green-300' : 'text-red-300'
                  }`}>
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                      lastResult.correct ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {lastResult.correct ? (
                        <span>Молодец! <strong>{lastResult.verb} {lastResult.actualPreposition}</strong> — <em>{lastResult.example}</em></span>
                      ) : (
                        <span>Ой! <strong>{lastResult.verb}</strong> идёт с <strong>{lastResult.actualPreposition}</strong>, а не <strong>{lastResult.columnPreposition}</strong>. Очко сопернику!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column preposition labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_PREPOSITIONS.map((prep, col) => (
                    <div key={col} className={`text-center font-bold text-base ${PREPOSITION_LABEL_COLORS[prep]}`}>
                      {prep}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-indigo-900/50 rounded-2xl p-4 shadow-inner">
                  <div className="grid grid-cols-7 gap-2">
                    {Array(7).fill().map((_, col) => (
                      <div
                        key={col}
                        className={`relative ${selectedVerb ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => handleColumnClick(col)}
                        onMouseEnter={() => setHoveredCol(col)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {hoveredCol === col && selectedVerb && gameState === 'playing' && (
                          <div className="absolute top-0 left-0 right-0 h-full bg-white/5 rounded-lg pointer-events-none" />
                        )}

                        {board.map((row, rowIndex) => {
                          const isWinning = winningCells.some(([r, c]) => r === rowIndex && c === col);
                          const isLastMove = lastMove?.row === rowIndex && lastMove?.col === col;
                          const isAnimating = animatingPieces.has(`${rowIndex}-${col}`);

                          return (
                            <div
                              key={rowIndex}
                              className={`aspect-square rounded-full border-4 border-indigo-800 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-indigo-950/50' : ''
                              } ${selectedVerb && row[col] === null ? 'hover:bg-indigo-900/50' : ''}`}
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
                        <span className="text-gray-200">Ничья!</span>
                      ) : winner === 'player1' ? (
                        <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Игрок 1 победил!</span>
                      ) : (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Игрок 2 победил!</span>
                      )}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-amber-400 via-pink-500 to-sky-500 hover:from-amber-500 hover:via-pink-600 hover:to-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Ещё раз
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Verb Panel */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-pink-300" />
                  <h2 className="text-lg font-semibold text-white">Глаголы</h2>
                  <span className="ml-auto text-sm text-gray-300">
                    осталось {availableVerbs.length}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {verbs.map((verbObj) => {
                    const key = verbKey(verbObj);
                    const isUsed = usedVerbs.has(key);
                    const isSelected = selectedVerb && verbKey(selectedVerb) === key;

                    return (
                      <button
                        key={key}
                        disabled={isUsed || gameState === 'gameOver'}
                        onClick={() => {
                          if (!isUsed && gameState === 'playing') {
                            setSelectedVerb(isSelected ? null : verbObj);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-pink-500/30 border-2 border-pink-300 shadow-lg shadow-pink-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className={`font-semibold ${isSelected ? 'text-pink-100' : 'text-white'}`}>
                            {verbObj.verb}
                          </span>
                          <span className="text-gray-300 text-xs ml-2">
                            {verbObj.translation}
                          </span>
                        </div>
                        {isUsed && (
                          <span className={`text-xs font-bold ${PREPOSITION_LABEL_COLORS[verbObj.preposition]}`}>
                            {verbObj.preposition}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {availableVerbs.length === 0 && gameState === 'playing' && (
                    <p className="text-gray-300 text-center py-4 text-sm">
                      Все глаголы использованы!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-300 mb-2">Столбцы — предлоги:</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {COLUMN_PREPOSITIONS.map((prep, i) => (
                      <span key={i} className={`${PREPOSITION_LABEL_COLORS[prep]} font-bold`}>
                        {i + 1}:{prep}
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

export default VerbPrepositionKidsGame;
