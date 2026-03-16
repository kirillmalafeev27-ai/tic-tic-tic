import React, { useState, useRef } from 'react';
import { RotateCcw, User, Users, GripVertical } from 'lucide-react';

// 7 columns: mir, dir, ihm, ihr, uns, ihnen, Ihnen
const COLUMN_ANSWERS = ['mir', 'dir', 'ihm', 'ihr', 'uns', 'ihnen', 'Ihnen'];

const ALL_SENTENCES = [
  // mir (7)
  { id: 'mir-1', sentence: 'Kannst du ___ bitte helfen?', hint: 'ich', answer: 'mir', translation: 'Можешь мне помочь?' },
  { id: 'mir-2', sentence: 'Er hat ___ ein Geschenk gegeben.', hint: 'ich', answer: 'mir', translation: 'Он дал мне подарок.' },
  { id: 'mir-3', sentence: 'Das Essen schmeckt ___ sehr gut.', hint: 'ich', answer: 'mir', translation: 'Еда мне очень нравится.' },
  { id: 'mir-4', sentence: 'Meine Mutter hat ___ einen Brief geschrieben.', hint: 'ich', answer: 'mir', translation: 'Мама написала мне письмо.' },
  { id: 'mir-5', sentence: 'Kannst du ___ das Buch geben?', hint: 'ich', answer: 'mir', translation: 'Можешь дать мне книгу?' },
  { id: 'mir-6', sentence: 'Es geht ___ heute nicht so gut.', hint: 'ich', answer: 'mir', translation: 'Мне сегодня не очень хорошо.' },
  { id: 'mir-7', sentence: 'Der Arzt hat ___ Tabletten verschrieben.', hint: 'ich', answer: 'mir', translation: 'Врач выписал мне таблетки.' },

  // dir (7)
  { id: 'dir-1', sentence: 'Ich helfe ___ gern bei den Hausaufgaben.', hint: 'du', answer: 'dir', translation: 'Я с удовольствием помогу тебе с домашним заданием.' },
  { id: 'dir-2', sentence: 'Hat er ___ die Nachricht geschickt?', hint: 'du', answer: 'dir', translation: 'Он отправил тебе сообщение?' },
  { id: 'dir-3', sentence: 'Ich bringe ___ morgen das Buch mit.', hint: 'du', answer: 'dir', translation: 'Я принесу тебе книгу завтра.' },
  { id: 'dir-4', sentence: 'Schmeckt ___ der Kuchen?', hint: 'du', answer: 'dir', translation: 'Тебе нравится торт?' },
  { id: 'dir-5', sentence: 'Was ist ___ passiert?', hint: 'du', answer: 'dir', translation: 'Что с тобой случилось?' },
  { id: 'dir-6', sentence: 'Ich habe ___ eine E-Mail geschrieben.', hint: 'du', answer: 'dir', translation: 'Я написал тебе электронное письмо.' },
  { id: 'dir-7', sentence: 'Wie geht es ___?', hint: 'du', answer: 'dir', translation: 'Как у тебя дела?' },

  // ihm (7)
  { id: 'ihm-1', sentence: 'Gib ___ bitte den Schlüssel!', hint: 'der Mann', answer: 'ihm', translation: 'Дай ему, пожалуйста, ключ!' },
  { id: 'ihm-2', sentence: 'Ich habe ___ beim Umzug geholfen.', hint: 'mein Bruder', answer: 'ihm', translation: 'Я помог ему с переездом.' },
  { id: 'ihm-3', sentence: 'Der Lehrer hat ___ eine gute Note gegeben.', hint: 'das Kind', answer: 'ihm', translation: 'Учитель поставил ему хорошую оценку.' },
  { id: 'ihm-4', sentence: 'Kannst du ___ Bescheid sagen?', hint: 'der Chef', answer: 'ihm', translation: 'Можешь ему сообщить?' },
  { id: 'ihm-5', sentence: 'Das Fahrrad gehört ___.', hint: 'mein Sohn', answer: 'ihm', translation: 'Велосипед принадлежит ему.' },
  { id: 'ihm-6', sentence: 'Ich habe ___ den Weg erklärt.', hint: 'der Tourist', answer: 'ihm', translation: 'Я объяснил ему дорогу.' },
  { id: 'ihm-7', sentence: 'Die Jacke passt ___ nicht mehr.', hint: 'der Junge', answer: 'ihm', translation: 'Куртка ему больше не подходит.' },

  // ihr (7)
  { id: 'ihr-1', sentence: 'Ich habe ___ Blumen mitgebracht.', hint: 'meine Freundin', answer: 'ihr', translation: 'Я принёс ей цветы.' },
  { id: 'ihr-2', sentence: 'Er hat ___ zum Geburtstag gratuliert.', hint: 'seine Mutter', answer: 'ihr', translation: 'Он поздравил её с днём рождения.' },
  { id: 'ihr-3', sentence: 'Kannst du ___ das Rezept geben?', hint: 'die Nachbarin', answer: 'ihr', translation: 'Можешь дать ей рецепт?' },
  { id: 'ihr-4', sentence: 'Der Rock steht ___ sehr gut.', hint: 'die Frau', answer: 'ihr', translation: 'Юбка ей очень идёт.' },
  { id: 'ihr-5', sentence: 'Ich muss ___ noch antworten.', hint: 'meine Schwester', answer: 'ihr', translation: 'Мне ещё нужно ей ответить.' },
  { id: 'ihr-6', sentence: 'Das Buch gehört ___.', hint: 'die Lehrerin', answer: 'ihr', translation: 'Книга принадлежит ей.' },
  { id: 'ihr-7', sentence: 'Er hat ___ bei der Arbeit geholfen.', hint: 'seine Kollegin', answer: 'ihr', translation: 'Он помог ей с работой.' },

  // uns (7)
  { id: 'uns-1', sentence: 'Der Kellner hat ___ die Speisekarte gebracht.', hint: 'wir', answer: 'uns', translation: 'Официант принёс нам меню.' },
  { id: 'uns-2', sentence: 'Kannst du ___ bitte den Weg zeigen?', hint: 'wir', answer: 'uns', translation: 'Можешь показать нам дорогу?' },
  { id: 'uns-3', sentence: 'Die Reise hat ___ sehr gut gefallen.', hint: 'wir', answer: 'uns', translation: 'Путешествие нам очень понравилось.' },
  { id: 'uns-4', sentence: 'Er hat ___ seine Wohnung gezeigt.', hint: 'wir', answer: 'uns', translation: 'Он показал нам свою квартиру.' },
  { id: 'uns-5', sentence: 'Das Konzert hat ___ begeistert.', hint: 'wir', answer: 'uns', translation: 'Концерт привёл нас в восторг.' },
  { id: 'uns-6', sentence: 'Die Nachbarn haben ___ zum Essen eingeladen.', hint: 'wir', answer: 'uns', translation: 'Соседи пригласили нас на ужин.' },
  { id: 'uns-7', sentence: 'Es geht ___ allen gut, danke!', hint: 'wir', answer: 'uns', translation: 'У нас всех всё хорошо, спасибо!' },

  // ihnen (7)
  { id: 'ihnen-1', sentence: 'Ich habe ___ die Hausaufgaben erklärt.', hint: 'die Schüler', answer: 'ihnen', translation: 'Я объяснил им домашнее задание.' },
  { id: 'ihnen-2', sentence: 'Kannst du ___ bitte Bescheid sagen?', hint: 'die Kinder', answer: 'ihnen', translation: 'Можешь им сообщить?' },
  { id: 'ihnen-3', sentence: 'Der Film hat ___ nicht gefallen.', hint: 'meine Eltern', answer: 'ihnen', translation: 'Фильм им не понравился.' },
  { id: 'ihnen-4', sentence: 'Wir haben ___ bei der Renovierung geholfen.', hint: 'die Nachbarn', answer: 'ihnen', translation: 'Мы помогли им с ремонтом.' },
  { id: 'ihnen-5', sentence: 'Gib ___ bitte die Bücher zurück!', hint: 'die Studenten', answer: 'ihnen', translation: 'Верни им книги, пожалуйста!' },
  { id: 'ihnen-6', sentence: 'Ich habe ___ ein Paket geschickt.', hint: 'meine Großeltern', answer: 'ihnen', translation: 'Я отправил им посылку.' },
  { id: 'ihnen-7', sentence: 'Das neue Haus gehört ___.', hint: 'die Müllers', answer: 'ihnen', translation: 'Новый дом принадлежит им.' },

  // Ihnen (6)
  { id: 'Ihnen-1', sentence: 'Kann ich ___ helfen?', hint: 'Sie', answer: 'Ihnen', translation: 'Могу я Вам помочь?' },
  { id: 'Ihnen-2', sentence: 'Ich schicke ___ die Rechnung per Post.', hint: 'Sie', answer: 'Ihnen', translation: 'Я отправлю Вам счёт по почте.' },
  { id: 'Ihnen-3', sentence: 'Wie geht es ___?', hint: 'Sie, formal', answer: 'Ihnen', translation: 'Как у Вас дела?' },
  { id: 'Ihnen-4', sentence: 'Darf ich ___ etwas zu trinken anbieten?', hint: 'Sie', answer: 'Ihnen', translation: 'Могу я предложить Вам что-нибудь выпить?' },
  { id: 'Ihnen-5', sentence: 'Ich wünsche ___ einen schönen Tag!', hint: 'Sie', answer: 'Ihnen', translation: 'Желаю Вам хорошего дня!' },
  { id: 'Ihnen-6', sentence: 'Der Kollege wird ___ alles zeigen.', hint: 'Sie', answer: 'Ihnen', translation: 'Коллега Вам всё покажет.' },
];

const ANSWER_LABEL_COLORS = {
  'mir': 'text-rose-400',
  'dir': 'text-amber-400',
  'ihm': 'text-blue-400',
  'ihr': 'text-pink-400',
  'uns': 'text-emerald-400',
  'ihnen': 'text-violet-400',
  'Ihnen': 'text-cyan-400',
};

const PLAYER_COLORS = {
  player1: 'from-red-400 to-pink-500',
  player2: 'from-yellow-400 to-orange-500',
};

const PLAYER_SHADOW = {
  player1: 'shadow-red-500/50',
  player2: 'shadow-yellow-500/50',
};

const DativPronomenGame = ({ onBack }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-rose-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dativ-Pronomen
            </h1>
            <p className="text-center text-gray-300 mb-2 text-lg">Personalpronomen im Dativ</p>
            <p className="text-center text-gray-400 mb-6 text-sm">
              Ersetze das Nomen im Dativ durch das richtige Personalpronomen!
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm text-gray-300">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    <td className="pb-1">Nominativ</td>
                    <td className="pb-1">→</td>
                    <td className="pb-1">Dativ</td>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr><td>ich</td><td>→</td><td className="text-rose-400 font-bold">mir</td></tr>
                  <tr><td>du</td><td>→</td><td className="text-amber-400 font-bold">dir</td></tr>
                  <tr><td>er / es</td><td>→</td><td className="text-blue-400 font-bold">ihm</td></tr>
                  <tr><td>sie (Sg.)</td><td>→</td><td className="text-pink-400 font-bold">ihr</td></tr>
                  <tr><td>wir</td><td>→</td><td className="text-emerald-400 font-bold">uns</td></tr>
                  <tr><td>sie (Pl.)</td><td>→</td><td className="text-violet-400 font-bold">ihnen</td></tr>
                  <tr><td>Sie (formal)</td><td>→</td><td className="text-cyan-400 font-bold">Ihnen</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-gray-300 space-y-2">
              <p>Wähle einen Satz und setze ihn in die Spalte mit dem richtigen Pronomen!</p>
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
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                      Dativ-Pronomen
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
                        <span className="text-gray-500 text-xs">({selectedSentence.hint})</span>
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
                    <div key={col} className={`text-center font-bold text-xs ${ANSWER_LABEL_COLORS[answer]}`}>
                      {answer}
                    </div>
                  ))}
                </div>

                {/* Board */}
                <div ref={boardRef} className="bg-rose-900/40 rounded-2xl p-4 shadow-inner">
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
                              className={`aspect-square rounded-full border-4 border-rose-800/60 relative overflow-hidden transition-all duration-300 ${
                                row[col] === null ? 'bg-rose-950/50' : ''
                              } ${selectedSentence && row[col] === null ? 'hover:bg-rose-900/50' : ''}`}
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
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
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
                  <GripVertical className="w-5 h-5 text-rose-400" />
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
                              ? 'bg-rose-500/30 border-2 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`text-sm ${isUsed ? 'line-through' : ''}`}>
                          <span className={`${isSelected ? 'text-rose-200' : 'text-white'}`}>
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
                          <span className="text-gray-500 text-xs ml-1.5">({sentObj.hint})</span>
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

export default DativPronomenGame;
