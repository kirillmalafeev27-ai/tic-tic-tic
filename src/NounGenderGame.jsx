import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';
import CursorGlow from './CursorGlow';

// 30 German nouns, A0.1 level, 10 per gender
const ALL_WORDS = [
  // der (masculine) - 10 words
  { word: 'Hund', gender: 'der', translation: 'dog' },
  { word: 'Mann', gender: 'der', translation: 'man' },
  { word: 'Tisch', gender: 'der', translation: 'table' },
  { word: 'Stuhl', gender: 'der', translation: 'chair' },
  { word: 'Apfel', gender: 'der', translation: 'apple' },
  { word: 'Ball', gender: 'der', translation: 'ball' },
  { word: 'Tag', gender: 'der', translation: 'day' },
  { word: 'Schuh', gender: 'der', translation: 'shoe' },
  { word: 'Baum', gender: 'der', translation: 'tree' },
  { word: 'Fisch', gender: 'der', translation: 'fish' },
  // die (feminine) - 10 words
  { word: 'Katze', gender: 'die', translation: 'cat' },
  { word: 'Frau', gender: 'die', translation: 'woman' },
  { word: 'Blume', gender: 'die', translation: 'flower' },
  { word: 'Lampe', gender: 'die', translation: 'lamp' },
  { word: 'Milch', gender: 'die', translation: 'milk' },
  { word: 'Tasse', gender: 'die', translation: 'cup' },
  { word: 'Uhr', gender: 'die', translation: 'clock' },
  { word: 'Nase', gender: 'die', translation: 'nose' },
  { word: 'Sonne', gender: 'die', translation: 'sun' },
  { word: 'Tasche', gender: 'die', translation: 'bag' },
  // das (neuter) - 10 words
  { word: 'Buch', gender: 'das', translation: 'book' },
  { word: 'Kind', gender: 'das', translation: 'child' },
  { word: 'Haus', gender: 'das', translation: 'house' },
  { word: 'Bett', gender: 'das', translation: 'bed' },
  { word: 'Bild', gender: 'das', translation: 'picture' },
  { word: 'Auto', gender: 'das', translation: 'car' },
  { word: 'Glas', gender: 'das', translation: 'glass' },
  { word: 'Brot', gender: 'das', translation: 'bread' },
  { word: 'Ei', gender: 'das', translation: 'egg' },
  { word: 'Tier', gender: 'das', translation: 'animal' },
];

// Column genders: der, die, das, der, die, das, der
const COLUMN_GENDERS = ['der', 'die', 'das', 'der', 'die', 'das', 'der'];

const GENDER_COLORS = {
  der: 'from-blue-400 to-blue-600',
  die: 'from-pink-400 to-pink-600',
  das: 'from-green-400 to-green-600',
};

const GENDER_LABEL_COLORS = {
  der: 'text-blue-400',
  die: 'text-pink-400',
  das: 'text-green-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const NounGenderGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState(new Set());
  const [selectedWord, setSelectedWord] = useState(null);
  const [usedWords, setUsedWords] = useState(new Set());
  const [lastResult, setLastResult] = useState(null); // { correct, word, column, actualGender, columnGender }
  const [words, setWords] = useState([]);
  const boardRef = useRef(null);

  // Shuffle words
  const shuffleWords = () => {
    const shuffled = [...ALL_WORDS].sort(() => Math.random() - 0.5);
    return shuffled;
  };

  // Check for winner
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

  // Check if board is full
  const isBoardFull = (board) => {
    return board[0].every(cell => cell !== null);
  };

  // Get available row in column
  const getAvailableRow = (board, col) => {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  // Handle column click - place selected word
  const handleColumnClick = (col) => {
    if (gameState !== 'playing' || !selectedWord) return;

    const row = getAvailableRow(board, col);
    if (row === -1) return;

    const columnGender = COLUMN_GENDERS[col];
    const wordGender = selectedWord.gender;
    const isCorrect = wordGender === columnGender;

    // If correct, piece is current player's color
    // If wrong, piece becomes opponent's color
    const pieceOwner = isCorrect ? currentPlayer : (currentPlayer === 'player1' ? 'player2' : 'player1');

    const pieceId = `${row}-${col}`;
    setAnimatingPieces(prev => new Set(prev).add(pieceId));

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = pieceOwner;
    setBoard(newBoard);
    setLastMove({ row, col });

    // Mark word as used
    setUsedWords(prev => new Set(prev).add(selectedWord.word));

    // Set result feedback
    setLastResult({
      correct: isCorrect,
      word: selectedWord.word,
      column: col,
      actualGender: wordGender,
      columnGender: columnGender,
      player: currentPlayer,
    });

    setSelectedWord(null);

    setTimeout(() => {
      setAnimatingPieces(prev => {
        const next = new Set(prev);
        next.delete(pieceId);
        return next;
      });
    }, 300);

    // Check for winner
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

    // Switch player
    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedWord(null);
    setUsedWords(new Set());
    setLastResult(null);
    setWords(shuffleWords());
  };

  // Reset game
  const resetGame = () => {
    setGameState('menu');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedWord(null);
    setUsedWords(new Set());
    setLastResult(null);
    setWords([]);
  };

  const availableWords = words.filter(w => !usedWords.has(w.word));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <CursorGlow colors="#3b82f6, #ec4899, #22c55e" size={500} blur={180} opacity={0.3} />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
            <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              Der Die Das
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">Genus-Spiel</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Lerne die Artikel deutscher Substantive!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-2">
              <p><span className="text-blue-400 font-bold">der</span> = maskulin | <span className="text-pink-400 font-bold">die</span> = feminin | <span className="text-green-400 font-bold">das</span> = neutral</p>
              <p>Jede Spalte hat einen Artikel. Wahle ein Wort und setze es in die richtige Spalte!</p>
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 group"
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
                      Der Die Das
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

                {/* Selected word indicator */}
                {gameState === 'playing' && (
                  <div className="mb-3 text-center">
                    {selectedWord ? (
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                        <span className="text-gray-400 text-sm">Gewahltes Wort:</span>
                        <span className="text-white font-bold text-lg">{selectedWord.word}</span>
                        <span className="text-gray-500 text-xs">({selectedWord.translation})</span>
                        <span className="text-gray-400 text-sm ml-2">→ Wahle eine Spalte!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                        <span className="text-gray-500 text-sm">← Wahle zuerst ein Wort aus der Liste</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Result feedback */}
                {lastResult && (
                  <div className={`mb-3 text-center transition-all duration-500 ${
                    lastResult.correct
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                      lastResult.correct ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {lastResult.correct ? (
                        <span>Richtig! <strong>{lastResult.actualGender} {lastResult.word}</strong></span>
                      ) : (
                        <span>Falsch! <strong>{lastResult.word}</strong> ist <strong>{lastResult.actualGender}</strong>, nicht {lastResult.columnGender}. Punkt fur den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column gender labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_GENDERS.map((gender, col) => (
                    <div key={col} className={`text-center font-bold text-sm ${GENDER_LABEL_COLORS[gender]}`}>
                      {gender}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-blue-900/50 rounded-2xl p-4 shadow-inner">
                  <div className="grid grid-cols-7 gap-2">
                    {Array(7).fill().map((_, col) => (
                      <div
                        key={col}
                        className={`relative ${selectedWord ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => handleColumnClick(col)}
                        onMouseEnter={() => setHoveredCol(col)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {/* Column hover effect */}
                        {hoveredCol === col && selectedWord && gameState === 'playing' && (
                          <div className="absolute top-0 left-0 right-0 h-full bg-white/5 rounded-lg pointer-events-none" />
                        )}

                        {/* Cells */}
                        {board.map((row, rowIndex) => {
                          const isWinning = winningCells.some(([r, c]) => r === rowIndex && c === col);
                          const isLastMove = lastMove?.row === rowIndex && lastMove?.col === col;
                          const isAnimating = animatingPieces.has(`${rowIndex}-${col}`);

                          return (
                            <div
                              key={rowIndex}
                              className={`aspect-square rounded-full border-4 border-blue-800 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-blue-950/50' : ''
                              } ${selectedWord && row[col] === null ? 'hover:bg-blue-900/50' : ''}`}
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
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Nochmal spielen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Word Panel */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Worter</h2>
                  <span className="ml-auto text-sm text-gray-400">
                    {availableWords.length} ubrig
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {words.map((wordObj) => {
                    const isUsed = usedWords.has(wordObj.word);
                    const isSelected = selectedWord?.word === wordObj.word;

                    return (
                      <button
                        key={wordObj.word}
                        disabled={isUsed || gameState === 'gameOver'}
                        onClick={() => {
                          if (!isUsed && gameState === 'playing') {
                            setSelectedWord(isSelected ? null : wordObj);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-purple-500/30 border-2 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className={`font-semibold ${isSelected ? 'text-purple-200' : 'text-white'}`}>
                            {wordObj.word}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {wordObj.translation}
                          </span>
                        </div>
                        {isUsed && (
                          <span className={`text-xs font-bold ${GENDER_LABEL_COLORS[wordObj.gender]}`}>
                            {wordObj.gender}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {availableWords.length === 0 && gameState === 'playing' && (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Alle Worter wurden benutzt!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Spalten-Artikel:</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {COLUMN_GENDERS.map((gender, i) => (
                      <span key={i} className={`${GENDER_LABEL_COLORS[gender]} font-bold`}>
                        {i + 1}:{gender}
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

export default NounGenderGame;
