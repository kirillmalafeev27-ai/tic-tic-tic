import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';
import CursorGlow from './CursorGlow';

// 7 columns: den(ist), die(sind), das(ist), den(ist), die(sind), das(ist), die(ist)
const COLUMN_ARTICLES = ['den', 'die', 'das', 'den', 'die', 'das', 'die'];
const COLUMN_VERB_FORMS = ['ist', 'sind', 'ist', 'ist', 'sind', 'ist', 'ist'];

// 9 A1 verbs
const VERBS = ['sehen', 'haben', 'kaufen', 'brauchen', 'suchen', 'finden', 'nehmen', 'trinken', 'essen'];

// 49 fixed cards: verb + article + noun + adjective
// 21 masculine (14 singular den/ist + 7 plural die/sind)
// 14 feminine (7 singular die/ist + 7 plural die/sind)
// 14 neuter (all singular das/ist)
const FIXED_CARDS = [
  // ── MASCULINE SINGULAR → den (ist) — 14 cards ──
  { verb: 'sehen', noun: 'Hund', article: 'den', verbForm: 'ist', adj: 'groß', translation: 'dog' },
  { verb: 'sehen', noun: 'Mann', article: 'den', verbForm: 'ist', adj: 'alt', translation: 'man' },
  { verb: 'sehen', noun: 'Fisch', article: 'den', verbForm: 'ist', adj: 'bunt', translation: 'fish' },
  { verb: 'haben', noun: 'Tisch', article: 'den', verbForm: 'ist', adj: 'groß', translation: 'table' },
  { verb: 'haben', noun: 'Stuhl', article: 'den', verbForm: 'ist', adj: 'alt', translation: 'chair' },
  { verb: 'kaufen', noun: 'Schuh', article: 'den', verbForm: 'ist', adj: 'teuer', translation: 'shoe' },
  { verb: 'kaufen', noun: 'Mantel', article: 'den', verbForm: 'ist', adj: 'elegant', translation: 'coat' },
  { verb: 'kaufen', noun: 'Stift', article: 'den', verbForm: 'ist', adj: 'billig', translation: 'pen' },
  { verb: 'brauchen', noun: 'Apfel', article: 'den', verbForm: 'ist', adj: 'groß', translation: 'apple' },
  { verb: 'brauchen', noun: 'Ball', article: 'den', verbForm: 'ist', adj: 'bunt', translation: 'ball' },
  { verb: 'brauchen', noun: 'Schrank', article: 'den', verbForm: 'ist', adj: 'neu', translation: 'cabinet' },
  { verb: 'suchen', noun: 'Baum', article: 'den', verbForm: 'ist', adj: 'groß', translation: 'tree' },
  { verb: 'essen', noun: 'Kuchen', article: 'den', verbForm: 'ist', adj: 'klein', translation: 'cake' },
  { verb: 'essen', noun: 'Käse', article: 'den', verbForm: 'ist', adj: 'alt', translation: 'cheese' },

  // ── MASCULINE PLURAL → die (sind) — 7 cards ──
  { verb: 'trinken', noun: 'Säfte', article: 'die', verbForm: 'sind', adj: 'billig', translation: 'juices' },
  { verb: 'trinken', noun: 'Tees', article: 'die', verbForm: 'sind', adj: 'neu', translation: 'teas' },
  { verb: 'kaufen', noun: 'Löffel', article: 'die', verbForm: 'sind', adj: 'teuer', translation: 'spoons' },
  { verb: 'brauchen', noun: 'Teller', article: 'die', verbForm: 'sind', adj: 'groß', translation: 'plates' },
  { verb: 'suchen', noun: 'Röcke', article: 'die', verbForm: 'sind', adj: 'elegant', translation: 'skirts' },
  { verb: 'finden', noun: 'Rucksäcke', article: 'die', verbForm: 'sind', adj: 'alt', translation: 'backpacks' },
  { verb: 'nehmen', noun: 'Tage', article: 'die', verbForm: 'sind', adj: 'schön', translation: 'days' },

  // ── FEMININE SINGULAR → die (ist) — 7 cards ──
  { verb: 'sehen', noun: 'Frau', article: 'die', verbForm: 'ist', adj: 'elegant', translation: 'woman' },
  { verb: 'finden', noun: 'Sonne', article: 'die', verbForm: 'ist', adj: 'schön', translation: 'sun' },
  { verb: 'haben', noun: 'Uhr', article: 'die', verbForm: 'ist', adj: 'teuer', translation: 'watch' },
  { verb: 'brauchen', noun: 'Lampe', article: 'die', verbForm: 'ist', adj: 'modern', translation: 'lamp' },
  { verb: 'finden', noun: 'Musik', article: 'die', verbForm: 'ist', adj: 'interessant', translation: 'music' },
  { verb: 'suchen', noun: 'Tür', article: 'die', verbForm: 'ist', adj: 'alt', translation: 'door' },
  { verb: 'trinken', noun: 'Milch', article: 'die', verbForm: 'ist', adj: 'billig', translation: 'milk' },

  // ── FEMININE PLURAL → die (sind) — 7 cards ──
  { verb: 'sehen', noun: 'Katzen', article: 'die', verbForm: 'sind', adj: 'lustig', translation: 'cats' },
  { verb: 'kaufen', noun: 'Blumen', article: 'die', verbForm: 'sind', adj: 'schön', translation: 'flowers' },
  { verb: 'brauchen', noun: 'Tassen', article: 'die', verbForm: 'sind', adj: 'klein', translation: 'cups' },
  { verb: 'suchen', noun: 'Taschen', article: 'die', verbForm: 'sind', adj: 'teuer', translation: 'bags' },
  { verb: 'kaufen', noun: 'Jacken', article: 'die', verbForm: 'sind', adj: 'neu', translation: 'jackets' },
  { verb: 'essen', noun: 'Suppen', article: 'die', verbForm: 'sind', adj: 'groß', translation: 'soups' },
  { verb: 'finden', noun: 'Zeitungen', article: 'die', verbForm: 'sind', adj: 'langweilig', translation: 'newspapers' },

  // ── NEUTER SINGULAR → das (ist) — 14 cards ──
  { verb: 'sehen', noun: 'Kind', article: 'das', verbForm: 'ist', adj: 'klein', translation: 'child' },
  { verb: 'sehen', noun: 'Tier', article: 'das', verbForm: 'ist', adj: 'lustig', translation: 'animal' },
  { verb: 'haben', noun: 'Auto', article: 'das', verbForm: 'ist', adj: 'schön', translation: 'car' },
  { verb: 'haben', noun: 'Handy', article: 'das', verbForm: 'ist', adj: 'neu', translation: 'phone' },
  { verb: 'kaufen', noun: 'Kleid', article: 'das', verbForm: 'ist', adj: 'elegant', translation: 'dress' },
  { verb: 'kaufen', noun: 'Buch', article: 'das', verbForm: 'ist', adj: 'interessant', translation: 'book' },
  { verb: 'brauchen', noun: 'Bett', article: 'das', verbForm: 'ist', adj: 'groß', translation: 'bed' },
  { verb: 'brauchen', noun: 'Glas', article: 'das', verbForm: 'ist', adj: 'groß', translation: 'glass' },
  { verb: 'suchen', noun: 'Haus', article: 'das', verbForm: 'ist', adj: 'alt', translation: 'house' },
  { verb: 'suchen', noun: 'Bild', article: 'das', verbForm: 'ist', adj: 'schön', translation: 'picture' },
  { verb: 'finden', noun: 'Fenster', article: 'das', verbForm: 'ist', adj: 'klein', translation: 'window' },
  { verb: 'essen', noun: 'Brot', article: 'das', verbForm: 'ist', adj: 'groß', translation: 'bread' },
  { verb: 'trinken', noun: 'Wasser', article: 'das', verbForm: 'ist', adj: 'billig', translation: 'water' },
  { verb: 'nehmen', noun: 'Ei', article: 'das', verbForm: 'ist', adj: 'klein', translation: 'egg' },
];

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

const VERB_FORM_COLORS = {
  'ist': 'text-amber-400',
  'sind': 'text-cyan-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

function generateCards() {
  return [...FIXED_CARDS]
    .map((c, i) => ({
      id: `${c.verb}-${c.noun}-${i}`,
      verb: c.verb,
      noun: c.noun,
      article: c.article,
      verbForm: c.verbForm,
      adj: c.adj,
      translation: c.translation,
      display: `${c.verb} → ${c.article} ${c.noun}`,
      fullSentence: `Ich ${c.verb} ${c.article} ${c.noun}. ${c.article === 'den' ? 'Der' : c.article === 'die' ? 'Die' : 'Das'} ${c.noun} ${c.verbForm} ${c.adj}.`,
    }))
    .sort(() => Math.random() - 0.5);
}

const AccusativeAdjectiveGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('menu');
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState(new Set());
  const [selectedCard, setSelectedCard] = useState(null);
  const [usedCards, setUsedCards] = useState(new Set());
  const [lastResult, setLastResult] = useState(null);
  const [cards, setCards] = useState([]);
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
    if (gameState !== 'playing' || !selectedCard) return;

    const row = getAvailableRow(board, col);
    if (row === -1) return;

    const columnArticle = COLUMN_ARTICLES[col];
    const columnVerbForm = COLUMN_VERB_FORMS[col];
    const isCorrect = selectedCard.article === columnArticle && selectedCard.verbForm === columnVerbForm;

    const pieceOwner = isCorrect ? currentPlayer : (currentPlayer === 'player1' ? 'player2' : 'player1');

    const pieceId = `${row}-${col}`;
    setAnimatingPieces(prev => new Set(prev).add(pieceId));

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = pieceOwner;
    setBoard(newBoard);
    setLastMove({ row, col });

    setUsedCards(prev => new Set(prev).add(selectedCard.id));

    setLastResult({
      correct: isCorrect,
      card: selectedCard,
      column: col,
      columnArticle,
      columnVerbForm,
      player: currentPlayer,
    });

    setSelectedCard(null);

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
    setSelectedCard(null);
    setUsedCards(new Set());
    setLastResult(null);
    setCards(generateCards());
  };

  const resetGame = () => {
    setGameState('menu');
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMove(null);
    setWinningCells([]);
    setSelectedCard(null);
    setUsedCards(new Set());
    setLastResult(null);
    setCards([]);
  };

  const availableCards = cards.filter(c => !usedCards.has(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <CursorGlow colors="#6366f1, #ec4899, #22c55e" size={500} blur={180} opacity={0.3} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              Akkusativ + Adjektiv
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">den / die / das + ist / sind</p>
            <p className="text-center text-gray-400 mb-8 text-sm">
              Lerne Akkusativ mit Adjektiven und Singular/Plural!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm text-gray-300 space-y-2">
              <p>Jede Karte zeigt: <span className="text-white font-bold">Verb / Artikel + Nomen / Adjektiv</span></p>
              <p>Spalten haben <span className="text-white font-bold">Artikel + Verb</span> (ist/sind):</p>
              <div className="flex gap-1.5 flex-wrap mt-1">
                {COLUMN_ARTICLES.map((art, i) => (
                  <span key={i} className={`text-xs font-bold px-2 py-1 rounded ${ARTICLE_LABEL_COLORS[art]} bg-white/5`}>
                    {art} <span className={VERB_FORM_COLORS[COLUMN_VERB_FORMS[i]]}>({COLUMN_VERB_FORMS[i]})</span>
                  </span>
                ))}
              </div>
              <p className="mt-2">Wähle die Spalte mit dem <span className="text-amber-400">richtigen Artikel</span> UND <span className="text-cyan-400">ist/sind</span>!</p>
              <p>Richtig = deine Farbe. Falsch = Farbe des Gegners!</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-6 text-xs text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">9 Verben:</p>
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
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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
                      Akkusativ + Adjektiv
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

                {/* Selected card indicator */}
                {gameState === 'playing' && (
                  <div className="mb-3 text-center">
                    {selectedCard ? (
                      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 flex-wrap justify-center">
                        <span className="text-gray-400 text-sm">Karte:</span>
                        <span className="text-white font-bold text-lg">
                          {selectedCard.verb} / {selectedCard.article} {selectedCard.noun} / <span className="text-amber-300">{selectedCard.adj}</span>
                        </span>
                        <span className="text-gray-500 text-xs">({selectedCard.translation})</span>
                        <span className="text-gray-400 text-sm ml-2">→ Wähle die richtige Spalte!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                        <span className="text-gray-500 text-sm">← Wähle zuerst eine Karte aus der Liste</span>
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
                        <span>Richtig! <strong>{lastResult.card.article} {lastResult.card.noun} ({lastResult.card.verbForm}) {lastResult.card.adj}</strong></span>
                      ) : (
                        <span>Falsch! <strong>{lastResult.card.noun}</strong> → <strong>{lastResult.card.article} ({lastResult.card.verbForm})</strong>, nicht {lastResult.columnArticle} ({lastResult.columnVerbForm}). Punkt für den Gegner!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Column labels: article + verb form */}
                <div className="grid grid-cols-7 gap-2 mb-1 px-4">
                  {COLUMN_ARTICLES.map((article, col) => (
                    <div key={col} className="text-center">
                      <div className={`font-bold text-sm ${ARTICLE_LABEL_COLORS[article]}`}>
                        {article}
                      </div>
                      <div className={`text-xs font-semibold ${VERB_FORM_COLORS[COLUMN_VERB_FORMS[col]]}`}>
                        ({COLUMN_VERB_FORMS[col]})
                      </div>
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-indigo-900/50 rounded-2xl p-4 shadow-inner">
                  <div className="grid grid-cols-7 gap-2">
                    {Array(7).fill().map((_, col) => (
                      <div
                        key={col}
                        className={`relative ${selectedCard ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => handleColumnClick(col)}
                        onMouseEnter={() => setHoveredCol(col)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {hoveredCol === col && selectedCard && gameState === 'playing' && (
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
                              } ${selectedCard && row[col] === null ? 'hover:bg-indigo-900/50' : ''}`}
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
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Nochmal spielen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Panel */}
            <div className="w-96">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">Karten</h2>
                  <span className="ml-auto text-sm text-gray-400">
                    {availableCards.length} übrig
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {cards.map((cardObj) => {
                    const isUsed = usedCards.has(cardObj.id);
                    const isSelected = selectedCard?.id === cardObj.id;

                    return (
                      <button
                        key={cardObj.id}
                        disabled={isUsed || gameState === 'gameOver'}
                        onClick={() => {
                          if (!isUsed && gameState === 'playing') {
                            setSelectedCard(isSelected ? null : cardObj);
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-200' : 'text-white'}`}>
                            {cardObj.verb}
                          </span>
                          <span className="text-gray-300 text-sm">
                            / {cardObj.article} {cardObj.noun}
                          </span>
                          <span className="text-amber-400 text-sm font-medium">
                            / {cardObj.adj}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({cardObj.translation})
                          </span>
                        </div>
                        {isUsed && (
                          <div className="flex items-center gap-1">
                            <span className={`text-xs font-bold ${ARTICLE_LABEL_COLORS[cardObj.article]}`}>
                              {cardObj.article}
                            </span>
                            <span className={`text-xs font-bold ${VERB_FORM_COLORS[cardObj.verbForm]}`}>
                              {cardObj.verbForm}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {availableCards.length === 0 && gameState === 'playing' && (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Alle Karten wurden benutzt!
                    </p>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Spalten:</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    {COLUMN_ARTICLES.map((article, i) => (
                      <span key={i} className="flex items-center gap-0.5">
                        <span className={`${ARTICLE_LABEL_COLORS[article]} font-bold`}>{article}</span>
                        <span className={`${VERB_FORM_COLORS[COLUMN_VERB_FORMS[i]]} font-bold`}>({COLUMN_VERB_FORMS[i]})</span>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p><span className="text-amber-400 font-bold">ist</span> = Singular | <span className="text-cyan-400 font-bold">sind</span> = Plural</p>
                    <p><span className="text-blue-400 font-bold">den</span> = maskulin | <span className="text-pink-400 font-bold">die</span> = feminin/Plural | <span className="text-green-400 font-bold">das</span> = neutral</p>
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

export default AccusativeAdjectiveGame;
