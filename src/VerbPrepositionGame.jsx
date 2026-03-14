import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';

// 7 unique prepositions for columns
const COLUMN_PREPOSITIONS = ['an', 'über', 'von', 'für', 'mit', 'auf', 'nach'];

// 50 German verbs with their required prepositions
const ALL_VERBS = [
  // an (Akk/Dat) - ~7
  { verb: 'sich erinnern', preposition: 'an', example: 'sich erinnern an', translation: 'to remember' },
  { verb: 'denken', preposition: 'an', example: 'denken an', translation: 'to think of' },
  { verb: 'glauben', preposition: 'an', example: 'glauben an', translation: 'to believe in' },
  { verb: 'teilnehmen', preposition: 'an', example: 'teilnehmen an', translation: 'to participate in' },
  { verb: 'sich gewöhnen', preposition: 'an', example: 'sich gewöhnen an', translation: 'to get used to' },
  { verb: 'sich wenden', preposition: 'an', example: 'sich wenden an', translation: 'to turn to' },
  { verb: 'zweifeln', preposition: 'an', example: 'zweifeln an', translation: 'to doubt' },

  // über (Akk) - ~7
  { verb: 'sich ärgern', preposition: 'über', example: 'sich ärgern über', translation: 'to be annoyed about' },
  { verb: 'sprechen', preposition: 'über', example: 'sprechen über', translation: 'to speak about' },
  { verb: 'sich freuen', preposition: 'über', example: 'sich freuen über', translation: 'to be happy about' },
  { verb: 'nachdenken', preposition: 'über', example: 'nachdenken über', translation: 'to think about' },
  { verb: 'sich beschweren', preposition: 'über', example: 'sich beschweren über', translation: 'to complain about' },
  { verb: 'diskutieren', preposition: 'über', example: 'diskutieren über', translation: 'to discuss' },
  { verb: 'lachen', preposition: 'über', example: 'lachen über', translation: 'to laugh about' },

  // von (Dat) - ~7
  { verb: 'träumen', preposition: 'von', example: 'träumen von', translation: 'to dream of' },
  { verb: 'erzählen', preposition: 'von', example: 'erzählen von', translation: 'to tell about' },
  { verb: 'abhängen', preposition: 'von', example: 'abhängen von', translation: 'to depend on' },
  { verb: 'sich erholen', preposition: 'von', example: 'sich erholen von', translation: 'to recover from' },
  { verb: 'sich verabschieden', preposition: 'von', example: 'sich verabschieden von', translation: 'to say goodbye to' },
  { verb: 'profitieren', preposition: 'von', example: 'profitieren von', translation: 'to profit from' },
  { verb: 'handeln', preposition: 'von', example: 'handeln von', translation: 'to be about' },

  // für (Akk) - ~7
  { verb: 'sich interessieren', preposition: 'für', example: 'sich interessieren für', translation: 'to be interested in' },
  { verb: 'sorgen', preposition: 'für', example: 'sorgen für', translation: 'to take care of' },
  { verb: 'sich entscheiden', preposition: 'für', example: 'sich entscheiden für', translation: 'to decide for' },
  { verb: 'danken', preposition: 'für', example: 'danken für', translation: 'to thank for' },
  { verb: 'sich entschuldigen', preposition: 'für', example: 'sich entschuldigen für', translation: 'to apologize for' },
  { verb: 'kämpfen', preposition: 'für', example: 'kämpfen für', translation: 'to fight for' },
  { verb: 'sich begeistern', preposition: 'für', example: 'sich begeistern für', translation: 'to be enthusiastic about' },

  // mit (Dat) - ~7
  { verb: 'anfangen', preposition: 'mit', example: 'anfangen mit', translation: 'to begin with' },
  { verb: 'aufhören', preposition: 'mit', example: 'aufhören mit', translation: 'to stop' },
  { verb: 'sich beschäftigen', preposition: 'mit', example: 'sich beschäftigen mit', translation: 'to deal with' },
  { verb: 'rechnen', preposition: 'mit', example: 'rechnen mit', translation: 'to count on' },
  { verb: 'sich unterhalten', preposition: 'mit', example: 'sich unterhalten mit', translation: 'to talk with' },
  { verb: 'vergleichen', preposition: 'mit', example: 'vergleichen mit', translation: 'to compare with' },
  { verb: 'zusammenhängen', preposition: 'mit', example: 'zusammenhängen mit', translation: 'to be connected with' },

  // auf (Akk) - ~8
  { verb: 'warten', preposition: 'auf', example: 'warten auf', translation: 'to wait for' },
  { verb: 'sich freuen', preposition: 'auf', example: 'sich freuen auf', translation: 'to look forward to' },
  { verb: 'achten', preposition: 'auf', example: 'achten auf', translation: 'to pay attention to' },
  { verb: 'sich vorbereiten', preposition: 'auf', example: 'sich vorbereiten auf', translation: 'to prepare for' },
  { verb: 'sich verlassen', preposition: 'auf', example: 'sich verlassen auf', translation: 'to rely on' },
  { verb: 'verzichten', preposition: 'auf', example: 'verzichten auf', translation: 'to give up' },
  { verb: 'sich konzentrieren', preposition: 'auf', example: 'sich konzentrieren auf', translation: 'to concentrate on' },
  { verb: 'ankommen', preposition: 'auf', example: 'ankommen auf', translation: 'to depend on' },

  // nach (Dat) - ~7
  { verb: 'fragen', preposition: 'nach', example: 'fragen nach', translation: 'to ask about' },
  { verb: 'sich sehnen', preposition: 'nach', example: 'sich sehnen nach', translation: 'to long for' },
  { verb: 'suchen', preposition: 'nach', example: 'suchen nach', translation: 'to search for' },
  { verb: 'riechen', preposition: 'nach', example: 'riechen nach', translation: 'to smell of' },
  { verb: 'schmecken', preposition: 'nach', example: 'schmecken nach', translation: 'to taste of' },
  { verb: 'sich erkundigen', preposition: 'nach', example: 'sich erkundigen nach', translation: 'to inquire about' },
  { verb: 'streben', preposition: 'nach', example: 'streben nach', translation: 'to strive for' },
];

const PREPOSITION_COLORS = {
  'an': 'from-blue-400 to-blue-600',
  'über': 'from-pink-400 to-pink-600',
  'von': 'from-green-400 to-green-600',
  'für': 'from-amber-400 to-amber-600',
  'mit': 'from-cyan-400 to-cyan-600',
  'auf': 'from-violet-400 to-violet-600',
  'nach': 'from-rose-400 to-rose-600',
};

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

const VerbPrepositionGame = ({ onBack }) => {
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

    setUsedVerbs(prev => new Set(prev).add(selectedVerb.verb));

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

  const availableVerbs = verbs.filter(v => !usedVerbs.has(v.verb));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Verb + Präposition
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">Rektion der Verben</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Lerne die festen Verb-Präposition-Verbindungen!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-2">
              <p>7 Präpositionen in 7 Spalten:</p>
              <div className="flex flex-wrap gap-2 my-2">
                {COLUMN_PREPOSITIONS.map(p => (
                  <span key={p} className={`${PREPOSITION_LABEL_COLORS[p]} font-bold px-2 py-1 bg-white/5 rounded`}>{p}</span>
                ))}
              </div>
              <p>Wähle ein Verb und setze es in die Spalte mit der richtigen Präposition!</p>
              <p>Richtig = deine Farbe. Falsch = Farbe des Gegners!</p>
              <p>4 in einer Reihe gewinnt!</p>
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
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                      Verb + Präposition
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
                        <span className="text-gray-400 text-sm">Gewähltes Verb:</span>
                        <span className="text-white font-bold text-lg">{selectedVerb.verb}</span>
                        <span className="text-gray-500 text-xs">({selectedVerb.translation})</span>
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
                        <span>Richtig! <strong>{lastResult.example}</strong></span>
                      ) : (
                        <span>Falsch! <strong>{lastResult.verb}</strong> → <strong>{lastResult.actualPreposition}</strong>, nicht {lastResult.columnPreposition}. Punkt für den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column preposition labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_PREPOSITIONS.map((prep, col) => (
                    <div key={col} className={`text-center font-bold text-sm ${PREPOSITION_LABEL_COLORS[prep]}`}>
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
                        <span className="text-gray-300">Unentschieden!</span>
                      ) : winner === 'player1' ? (
                        <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Spieler 1 gewinnt!</span>
                      ) : (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Spieler 2 gewinnt!</span>
                      )}
                    </h2>
                    <button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
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
                  <GripVertical className="w-5 h-5 text-indigo-400" />
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
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-indigo-500/30 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className={`font-semibold ${isSelected ? 'text-indigo-200' : 'text-white'}`}>
                            {verbObj.verb}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
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
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Alle Verben wurden benutzt!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Spalten-Präpositionen:</p>
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

export default VerbPrepositionGame;
