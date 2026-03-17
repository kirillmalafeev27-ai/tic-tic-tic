import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';
import CursorGlow from './CursorGlow';

// 42 German verbs for Perfekt, no auxiliary shown — student must choose haben or sein
const ALL_VERBS = [
  // sein (18 verbs) — movement, change of state, sein/bleiben
  { verb: 'gehen', partizip: 'gegangen', auxiliary: 'sein', example: 'Ich ___ nach Hause gegangen.', translation: 'Я пошёл домой.' },
  { verb: 'kommen', partizip: 'gekommen', auxiliary: 'sein', example: 'Er ___ gestern gekommen.', translation: 'Он пришёл вчера.' },
  { verb: 'fahren', partizip: 'gefahren', auxiliary: 'sein', example: 'Wir ___ nach Berlin gefahren.', translation: 'Мы поехали в Берлин.' },
  { verb: 'fliegen', partizip: 'geflogen', auxiliary: 'sein', example: 'Sie ___ nach Paris geflogen.', translation: 'Она полетела в Париж.' },
  { verb: 'laufen', partizip: 'gelaufen', auxiliary: 'sein', example: 'Das Kind ___ schnell gelaufen.', translation: 'Ребёнок быстро побежал.' },
  { verb: 'schwimmen', partizip: 'geschwommen', auxiliary: 'sein', example: 'Er ___ über den See geschwommen.', translation: 'Он переплыл озеро.' },
  { verb: 'reisen', partizip: 'gereist', auxiliary: 'sein', example: 'Sie ___ nach Italien gereist.', translation: 'Они поехали в Италию.' },
  { verb: 'fallen', partizip: 'gefallen', auxiliary: 'sein', example: 'Das Blatt ___ vom Baum gefallen.', translation: 'Лист упал с дерева.' },
  { verb: 'steigen', partizip: 'gestiegen', auxiliary: 'sein', example: 'Die Preise ___ gestiegen.', translation: 'Цены выросли.' },
  { verb: 'werden', partizip: 'geworden', auxiliary: 'sein', example: 'Er ___ Arzt geworden.', translation: 'Он стал врачом.' },
  { verb: 'sterben', partizip: 'gestorben', auxiliary: 'sein', example: 'Die Pflanze ___ gestorben.', translation: 'Растение погибло.' },
  { verb: 'wachsen', partizip: 'gewachsen', auxiliary: 'sein', example: 'Das Kind ___ schnell gewachsen.', translation: 'Ребёнок быстро вырос.' },
  { verb: 'einschlafen', partizip: 'eingeschlafen', auxiliary: 'sein', example: 'Ich ___ sofort eingeschlafen.', translation: 'Я сразу уснул.' },
  { verb: 'aufwachen', partizip: 'aufgewacht', auxiliary: 'sein', example: 'Sie ___ früh aufgewacht.', translation: 'Она проснулась рано.' },
  { verb: 'sein', partizip: 'gewesen', auxiliary: 'sein', example: 'Ich ___ in Deutschland gewesen.', translation: 'Я был в Германии.' },
  { verb: 'bleiben', partizip: 'geblieben', auxiliary: 'sein', example: 'Er ___ zu Hause geblieben.', translation: 'Он остался дома.' },
  { verb: 'passieren', partizip: 'passiert', auxiliary: 'sein', example: 'Was ___ gestern passiert?', translation: 'Что вчера произошло?' },
  { verb: 'umziehen', partizip: 'umgezogen', auxiliary: 'sein', example: 'Wir ___ nach München umgezogen.', translation: 'Мы переехали в Мюнхен.' },

  // haben (24 verbs)
  { verb: 'machen', partizip: 'gemacht', auxiliary: 'haben', example: 'Ich ___ meine Hausaufgaben gemacht.', translation: 'Я сделал домашнее задание.' },
  { verb: 'kaufen', partizip: 'gekauft', auxiliary: 'haben', example: 'Sie ___ ein neues Kleid gekauft.', translation: 'Она купила новое платье.' },
  { verb: 'essen', partizip: 'gegessen', auxiliary: 'haben', example: 'Wir ___ Pizza gegessen.', translation: 'Мы ели пиццу.' },
  { verb: 'trinken', partizip: 'getrunken', auxiliary: 'haben', example: 'Er ___ Kaffee getrunken.', translation: 'Он пил кофе.' },
  { verb: 'lesen', partizip: 'gelesen', auxiliary: 'haben', example: 'Ich ___ das Buch gelesen.', translation: 'Я прочитал книгу.' },
  { verb: 'schreiben', partizip: 'geschrieben', auxiliary: 'haben', example: 'Sie ___ einen Brief geschrieben.', translation: 'Она написала письмо.' },
  { verb: 'sprechen', partizip: 'gesprochen', auxiliary: 'haben', example: 'Wir ___ mit dem Lehrer gesprochen.', translation: 'Мы поговорили с учителем.' },
  { verb: 'sehen', partizip: 'gesehen', auxiliary: 'haben', example: 'Ich ___ den Film gesehen.', translation: 'Я посмотрел фильм.' },
  { verb: 'hören', partizip: 'gehört', auxiliary: 'haben', example: 'Er ___ Musik gehört.', translation: 'Он слушал музыку.' },
  { verb: 'spielen', partizip: 'gespielt', auxiliary: 'haben', example: 'Die Kinder ___ Fußball gespielt.', translation: 'Дети играли в футбол.' },
  { verb: 'arbeiten', partizip: 'gearbeitet', auxiliary: 'haben', example: 'Sie ___ den ganzen Tag gearbeitet.', translation: 'Она работала весь день.' },
  { verb: 'lernen', partizip: 'gelernt', auxiliary: 'haben', example: 'Ich ___ Deutsch gelernt.', translation: 'Я учил немецкий.' },
  { verb: 'kochen', partizip: 'gekocht', auxiliary: 'haben', example: 'Er ___ Suppe gekocht.', translation: 'Он сварил суп.' },
  { verb: 'schlafen', partizip: 'geschlafen', auxiliary: 'haben', example: 'Ich ___ gut geschlafen.', translation: 'Я хорошо спал.' },
  { verb: 'singen', partizip: 'gesungen', auxiliary: 'haben', example: 'Sie ___ ein Lied gesungen.', translation: 'Она спела песню.' },
  { verb: 'tanzen', partizip: 'getanzt', auxiliary: 'haben', example: 'Wir ___ die ganze Nacht getanzt.', translation: 'Мы танцевали всю ночь.' },
  { verb: 'helfen', partizip: 'geholfen', auxiliary: 'haben', example: 'Er ___ mir geholfen.', translation: 'Он мне помог.' },
  { verb: 'nehmen', partizip: 'genommen', auxiliary: 'haben', example: 'Ich ___ den Bus genommen.', translation: 'Я сел на автобус.' },
  { verb: 'geben', partizip: 'gegeben', auxiliary: 'haben', example: 'Sie ___ mir ein Geschenk gegeben.', translation: 'Она дала мне подарок.' },
  { verb: 'finden', partizip: 'gefunden', auxiliary: 'haben', example: 'Wir ___ den Schlüssel gefunden.', translation: 'Мы нашли ключ.' },
  { verb: 'vergessen', partizip: 'vergessen', auxiliary: 'haben', example: 'Ich ___ meinen Pass vergessen.', translation: 'Я забыл свой паспорт.' },
  { verb: 'verstehen', partizip: 'verstanden', auxiliary: 'haben', example: 'Er ___ die Frage verstanden.', translation: 'Он понял вопрос.' },
  { verb: 'bekommen', partizip: 'bekommen', auxiliary: 'haben', example: 'Sie ___ einen Brief bekommen.', translation: 'Она получила письмо.' },
  { verb: 'anrufen', partizip: 'angerufen', auxiliary: 'haben', example: 'Ich ___ meine Mutter angerufen.', translation: 'Я позвонил маме.' },
];

// Column auxiliaries: haben, sein, haben, sein, haben, sein, haben
const COLUMN_AUXILIARIES = ['haben', 'sein', 'haben', 'sein', 'haben', 'sein', 'haben'];

const AUX_COLORS = {
  haben: 'from-emerald-400 to-teal-600',
  sein: 'from-amber-400 to-yellow-600',
};

const AUX_LABEL_COLORS = {
  haben: 'text-emerald-400',
  sein: 'text-amber-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const PerfektGame = ({ onBack }) => {
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

    const columnAux = COLUMN_AUXILIARIES[col];
    const verbAux = selectedVerb.auxiliary;
    const isCorrect = verbAux === columnAux;

    const pieceOwner = isCorrect ? currentPlayer : (currentPlayer === 'player1' ? 'player2' : 'player1');

    const pieceId = `${row}-${col}`;
    setAnimatingPieces(prev => new Set(prev).add(pieceId));

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = pieceOwner;
    setBoard(newBoard);
    setLastMove({ row, col });

    setUsedVerbs(prev => new Set(prev).add(selectedVerb.verb));

    setLastResult({
      correct: isCorrect,
      verb: selectedVerb.verb,
      partizip: selectedVerb.partizip,
      column: col,
      actualAux: verbAux,
      columnAux: columnAux,
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

  const availableVerbs = verbs.filter(v => !usedVerbs.has(v.verb));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
      <CursorGlow colors="#10b981, #f59e0b, #14b8a6" size={500} blur={180} opacity={0.3} />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
            <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 bg-clip-text text-transparent">
              Perfekt
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">haben oder sein?</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Wähle das richtige Hilfsverb im Perfekt!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-2">
              <p><span className="text-emerald-400 font-bold">haben</span> = die meisten Verben | <span className="text-amber-400 font-bold">sein</span> = Bewegung & Zustandswechsel</p>
              <p>Jede Spalte hat ein Hilfsverb. Wähle ein Verb und setze es in die richtige Spalte!</p>
              <p>Richtig = deine Farbe. Falsch = Farbe des Gegners!</p>
              <p>4 in einer Reihe gewinnt (horizontal, vertikal oder diagonal).</p>
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
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 group"
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 bg-clip-text text-transparent">
                      Perfekt
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

                {/* Selected verb indicator */}
                {gameState === 'playing' && (
                  <div className="mb-3 text-center">
                    {selectedVerb ? (
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                        <span className="text-gray-400 text-sm">Satz:</span>
                        <span className="text-gray-200 font-medium text-sm">{selectedVerb.example}</span>
                        <span className="text-gray-400 text-sm ml-2">→ Wähle eine Spalte!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                        <span className="text-gray-500 text-sm">← Wähle zuerst ein Verb aus der Liste</span>
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
                        <span>Richtig! <strong>{lastResult.actualAux} {lastResult.partizip}</strong></span>
                      ) : (
                        <span>Falsch! <strong>{lastResult.verb}</strong> → <strong>{lastResult.actualAux}</strong>, nicht {lastResult.columnAux}. Punkt für den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column auxiliary labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_AUXILIARIES.map((aux, col) => (
                    <div key={col} className={`text-center font-bold text-sm ${AUX_LABEL_COLORS[aux]}`}>
                      {aux}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-emerald-900/40 rounded-2xl p-4 shadow-inner">
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
                              className={`aspect-square rounded-full border-4 border-emerald-800 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-emerald-950/50' : ''
                              } ${selectedVerb && row[col] === null ? 'hover:bg-emerald-900/50' : ''}`}
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
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Nochmal spielen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Verb Panel */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Verben</h2>
                  <span className="ml-auto text-sm text-gray-400">
                    {availableVerbs.length} übrig
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {verbs.map((verbObj) => {
                    const isUsed = usedVerbs.has(verbObj.verb);
                    const isSelected = selectedVerb?.verb === verbObj.verb;

                    return (
                      <button
                        key={verbObj.verb}
                        disabled={isUsed || gameState === 'gameOver'}
                        onClick={() => {
                          if (!isUsed && gameState === 'playing') {
                            setSelectedVerb(isSelected ? null : verbObj);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`font-semibold ${isSelected ? 'text-emerald-200' : 'text-gray-200'}`}>
                              {verbObj.verb}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">→ {verbObj.partizip}</span>
                          </div>
                          {isUsed && (
                            <span className={`text-xs font-bold ${AUX_LABEL_COLORS[verbObj.auxiliary]}`}>
                              {verbObj.auxiliary}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {verbObj.translation}
                        </div>
                      </button>
                    );
                  })}

                  {availableVerbs.length === 0 && gameState === 'playing' && (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Alle Verben wurden benutzt!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Spalten-Hilfsverben:</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {COLUMN_AUXILIARIES.map((aux, i) => (
                      <span key={i} className={`${AUX_LABEL_COLORS[aux]} font-bold`}>
                        {i + 1}:{aux}
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

export default PerfektGame;
