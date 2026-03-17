import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';
import CursorGlow from './CursorGlow';

// Column articles in Akkusativ: den (maskulin), die (feminin), das (neutral)
// In Akkusativ only maskulin changes: der → den
// Columns: den, die, das, den, die, das, den
const COLUMN_ARTICLES = ['den', 'die', 'das', 'den', 'die', 'das', 'den'];

// 45 nouns: 15 per gender
const ALL_NOUNS = [
  // der → den (maskulin) - 15 words
  { word: 'Hund', article: 'den', nominativ: 'der', translation: 'dog' },
  { word: 'Mann', article: 'den', nominativ: 'der', translation: 'man' },
  { word: 'Tisch', article: 'den', nominativ: 'der', translation: 'table' },
  { word: 'Stuhl', article: 'den', nominativ: 'der', translation: 'chair' },
  { word: 'Apfel', article: 'den', nominativ: 'der', translation: 'apple' },
  { word: 'Ball', article: 'den', nominativ: 'der', translation: 'ball' },
  { word: 'Tag', article: 'den', nominativ: 'der', translation: 'day' },
  { word: 'Schuh', article: 'den', nominativ: 'der', translation: 'shoe' },
  { word: 'Baum', article: 'den', nominativ: 'der', translation: 'tree' },
  { word: 'Fisch', article: 'den', nominativ: 'der', translation: 'fish' },
  { word: 'Kuchen', article: 'den', nominativ: 'der', translation: 'cake' },
  { word: 'Saft', article: 'den', nominativ: 'der', translation: 'juice' },
  { word: 'Tee', article: 'den', nominativ: 'der', translation: 'tea' },
  { word: 'Käse', article: 'den', nominativ: 'der', translation: 'cheese' },
  { word: 'Mantel', article: 'den', nominativ: 'der', translation: 'coat' },

  // die (feminin) - 15 words
  { word: 'Katze', article: 'die', nominativ: 'die', translation: 'cat' },
  { word: 'Frau', article: 'die', nominativ: 'die', translation: 'woman' },
  { word: 'Blume', article: 'die', nominativ: 'die', translation: 'flower' },
  { word: 'Lampe', article: 'die', nominativ: 'die', translation: 'lamp' },
  { word: 'Milch', article: 'die', nominativ: 'die', translation: 'milk' },
  { word: 'Tasse', article: 'die', nominativ: 'die', translation: 'cup' },
  { word: 'Uhr', article: 'die', nominativ: 'die', translation: 'clock' },
  { word: 'Nase', article: 'die', nominativ: 'die', translation: 'nose' },
  { word: 'Sonne', article: 'die', nominativ: 'die', translation: 'sun' },
  { word: 'Tasche', article: 'die', nominativ: 'die', translation: 'bag' },
  { word: 'Jacke', article: 'die', nominativ: 'die', translation: 'jacket' },
  { word: 'Suppe', article: 'die', nominativ: 'die', translation: 'soup' },
  { word: 'Zeitung', article: 'die', nominativ: 'die', translation: 'newspaper' },
  { word: 'Musik', article: 'die', nominativ: 'die', translation: 'music' },
  { word: 'Tür', article: 'die', nominativ: 'die', translation: 'door' },

  // das (neutral) - 15 words
  { word: 'Buch', article: 'das', nominativ: 'das', translation: 'book' },
  { word: 'Kind', article: 'das', nominativ: 'das', translation: 'child' },
  { word: 'Haus', article: 'das', nominativ: 'das', translation: 'house' },
  { word: 'Bett', article: 'das', nominativ: 'das', translation: 'bed' },
  { word: 'Bild', article: 'das', nominativ: 'das', translation: 'picture' },
  { word: 'Auto', article: 'das', nominativ: 'das', translation: 'car' },
  { word: 'Glas', article: 'das', nominativ: 'das', translation: 'glass' },
  { word: 'Brot', article: 'das', nominativ: 'das', translation: 'bread' },
  { word: 'Ei', article: 'das', nominativ: 'das', translation: 'egg' },
  { word: 'Tier', article: 'das', nominativ: 'das', translation: 'animal' },
  { word: 'Handy', article: 'das', nominativ: 'das', translation: 'phone' },
  { word: 'Fenster', article: 'das', nominativ: 'das', translation: 'window' },
  { word: 'Wasser', article: 'das', nominativ: 'das', translation: 'water' },
  { word: 'Kleid', article: 'das', nominativ: 'das', translation: 'dress' },
  { word: 'Spiel', article: 'das', nominativ: 'das', translation: 'game' },
];

// 9 A1 verbs (5 sentences each = 45 sentences)
const VERBS = ['sehen', 'haben', 'kaufen', 'brauchen', 'suchen', 'finden', 'nehmen', 'trinken', 'essen'];

// Generate 45 sentences: each verb gets 5 nouns (mix of genders)
function generateSentences() {
  const sentences = [];
  const shuffledNouns = [...ALL_NOUNS].sort(() => Math.random() - 0.5);

  VERBS.forEach((verb, vIdx) => {
    for (let i = 0; i < 5; i++) {
      const noun = shuffledNouns[vIdx * 5 + i];
      sentences.push({
        id: `${verb}-${noun.word}`,
        verb,
        noun: noun.word,
        article: noun.article,
        translation: noun.translation,
        sentence: `Ich ___ ${noun.article} ${noun.word}.`,
        display: `${verb} → ${noun.word}`,
        fullSentence: `Ich ${verb} ${noun.article} ${noun.word}.`,
      });
    }
  });

  return sentences.sort(() => Math.random() - 0.5);
}

const ARTICLE_COLORS = {
  'den': 'from-blue-400 to-blue-600',
  'die': 'from-pink-400 to-pink-600',
  'das': 'from-green-400 to-green-600',
};

const ARTICLE_LABEL_COLORS = {
  'den': 'text-blue-400',
  'die': 'text-pink-400',
  'das': 'text-green-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const AccusativeGame = ({ onBack }) => {
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

    const columnArticle = COLUMN_ARTICLES[col];
    const correctArticle = selectedSentence.article;
    const isCorrect = correctArticle === columnArticle;

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
      actualArticle: correctArticle,
      columnArticle: columnArticle,
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
    setSentences(generateSentences());
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      <CursorGlow colors="#10b981, #3b82f6, #ec4899" size={500} blur={180} opacity={0.3} />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
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
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              Akkusativ
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">den / die / das</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Lerne den Akkusativ mit Verben und Substantiven!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-2">
              <p>Im Akkusativ ändert sich nur <span className="text-blue-400 font-bold">der</span> → <span className="text-blue-400 font-bold">den</span>!</p>
              <p><span className="text-blue-400 font-bold">den</span> = maskulin | <span className="text-pink-400 font-bold">die</span> = feminin | <span className="text-green-400 font-bold">das</span> = neutral</p>
              <p>Du siehst ein Verb + Substantiv. Wähle die Spalte mit dem richtigen Artikel im Akkusativ!</p>
              <p>Richtig = deine Farbe. Falsch = Farbe des Gegners!</p>
              <p>4 in einer Reihe gewinnt!</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-6 text-xs text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">9 Verben × 5 Sätze = 45 Aufgaben:</p>
              <div className="flex flex-wrap gap-1.5">
                {VERBS.map(v => (
                  <span key={v} className="px-2 py-0.5 bg-white/5 rounded text-gray-300">{v}</span>
                ))}
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
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
                      Akkusativ: den / die / das
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
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 flex-wrap justify-center">
                        <span className="text-gray-400 text-sm">Satz:</span>
                        <span className="text-white font-bold text-lg">
                          Ich {selectedSentence.verb} <span className="text-yellow-300">___</span> {selectedSentence.noun}
                        </span>
                        <span className="text-gray-500 text-xs">({selectedSentence.translation})</span>
                        <span className="text-gray-400 text-sm ml-2">→ Wähle den richtigen Artikel!</span>
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
                        <span>Richtig! <strong>{lastResult.sentence.fullSentence}</strong></span>
                      ) : (
                        <span>Falsch! <strong>{lastResult.sentence.noun}</strong> → <strong>{lastResult.actualArticle}</strong>, nicht {lastResult.columnArticle}. Punkt für den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column article labels */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_ARTICLES.map((article, col) => (
                    <div key={col} className={`text-center font-bold text-sm ${ARTICLE_LABEL_COLORS[article]}`}>
                      {article}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-emerald-900/50 rounded-2xl p-4 shadow-inner">
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
                              className={`aspect-square rounded-full border-4 border-emerald-800 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-emerald-950/50' : ''
                              } ${selectedSentence && row[col] === null ? 'hover:bg-emerald-900/50' : ''}`}
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

            {/* Sentence Panel */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-emerald-400" />
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
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          isUsed
                            ? 'bg-white/5 opacity-30 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className={`font-semibold text-sm ${isSelected ? 'text-emerald-200' : 'text-white'}`}>
                            {sentObj.verb}
                          </span>
                          <span className="text-gray-300 text-sm ml-1">
                            → {sentObj.noun}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            ({sentObj.translation})
                          </span>
                        </div>
                        {isUsed && (
                          <span className={`text-xs font-bold ${ARTICLE_LABEL_COLORS[sentObj.article]}`}>
                            {sentObj.article}
                          </span>
                        )}
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
                  <p className="text-xs text-gray-500 mb-2">Akkusativ-Artikel:</p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-blue-400 font-bold">der → den</span>
                    <span className="text-pink-400 font-bold">die → die</span>
                    <span className="text-green-400 font-bold">das → das</span>
                  </div>
                  <div className="flex gap-2 text-xs flex-wrap mt-2">
                    {COLUMN_ARTICLES.map((article, i) => (
                      <span key={i} className={`${ARTICLE_LABEL_COLORS[article]} font-bold`}>
                        {i + 1}:{article}
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

export default AccusativeGame;
