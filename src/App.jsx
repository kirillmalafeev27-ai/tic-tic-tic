import { useState } from 'react'
import NounGenderGame from './NounGenderGame'
import VerbPrepositionGame from './VerbPrepositionGame'
import AccusativeGame from './AccusativeGame'
import WennWannAlsGame from './WennWannAlsGame'
import DativPronomenGame from './DativPronomenGame'
import CursorGlow from './CursorGlow'

function App() {
  const [activeGame, setActiveGame] = useState(null)

  if (activeGame === 'noun-gender') {
    return <NounGenderGame onBack={() => setActiveGame(null)} />
  }

  if (activeGame === 'verb-preposition') {
    return <VerbPrepositionGame onBack={() => setActiveGame(null)} />
  }

  if (activeGame === 'accusative') {
    return <AccusativeGame onBack={() => setActiveGame(null)} />
  }

  if (activeGame === 'wenn-wann-als') {
    return <WennWannAlsGame onBack={() => setActiveGame(null)} />
  }

  if (activeGame === 'dativ-pronomen') {
    return <DativPronomenGame onBack={() => setActiveGame(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <CursorGlow colors="#a855f7, #ec4899, #3b82f6" size={500} blur={180} opacity={0.35} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl w-full px-6">
          <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            Deutsch Spiele
          </h1>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Wähle ein Spiel zum Üben!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <button
              onClick={() => setActiveGame('noun-gender')}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-left"
            >
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
                Der Die Das
              </h2>
              <p className="text-gray-300 text-sm mb-4">Genus-Spiel</p>
              <p className="text-gray-500 text-xs">
                Lerne die Artikel deutscher Substantive! 30 Wörter, 3 Artikel.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-blue-400 font-bold text-xs px-2 py-1 bg-blue-400/10 rounded">der</span>
                <span className="text-pink-400 font-bold text-xs px-2 py-1 bg-pink-400/10 rounded">die</span>
                <span className="text-green-400 font-bold text-xs px-2 py-1 bg-green-400/10 rounded">das</span>
              </div>
            </button>

            <button
              onClick={() => setActiveGame('verb-preposition')}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-left"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Verb + Präposition
              </h2>
              <p className="text-gray-300 text-sm mb-4">Rektion der Verben</p>
              <p className="text-gray-500 text-xs">
                Lerne die festen Verb-Präposition-Verbindungen! 50 Verben, 7 Präpositionen.
              </p>
              <div className="flex gap-1.5 mt-4 flex-wrap">
                <span className="text-blue-400 font-bold text-xs px-2 py-1 bg-blue-400/10 rounded">an</span>
                <span className="text-pink-400 font-bold text-xs px-2 py-1 bg-pink-400/10 rounded">über</span>
                <span className="text-green-400 font-bold text-xs px-2 py-1 bg-green-400/10 rounded">von</span>
                <span className="text-amber-400 font-bold text-xs px-2 py-1 bg-amber-400/10 rounded">für</span>
                <span className="text-cyan-400 font-bold text-xs px-2 py-1 bg-cyan-400/10 rounded">mit</span>
                <span className="text-violet-400 font-bold text-xs px-2 py-1 bg-violet-400/10 rounded">auf</span>
                <span className="text-rose-400 font-bold text-xs px-2 py-1 bg-rose-400/10 rounded">nach</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGame('accusative')}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-left"
            >
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                Akkusativ
              </h2>
              <p className="text-gray-300 text-sm mb-4">den / die / das</p>
              <p className="text-gray-500 text-xs">
                Übe den Akkusativ mit 45 Sätzen! 9 Verben, 45 Substantive.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-blue-400 font-bold text-xs px-2 py-1 bg-blue-400/10 rounded">den</span>
                <span className="text-pink-400 font-bold text-xs px-2 py-1 bg-pink-400/10 rounded">die</span>
                <span className="text-green-400 font-bold text-xs px-2 py-1 bg-green-400/10 rounded">das</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGame('wenn-wann-als')}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-left"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                wenn / wann / als
              </h2>
              <p className="text-gray-300 text-sm mb-4">Temporale Nebensätze</p>
              <p className="text-gray-500 text-xs">
                Lerne den Unterschied! 48 Sätze mit wenn, wann und als.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-amber-400 font-bold text-xs px-2 py-1 bg-amber-400/10 rounded">wenn</span>
                <span className="text-sky-400 font-bold text-xs px-2 py-1 bg-sky-400/10 rounded">wann</span>
                <span className="text-violet-400 font-bold text-xs px-2 py-1 bg-violet-400/10 rounded">als</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGame('dativ-pronomen')}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 text-left"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-rose-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Dativ-Pronomen
              </h2>
              <p className="text-gray-300 text-sm mb-4">Personalpronomen</p>
              <p className="text-gray-500 text-xs">
                Ersetze das Nomen durch das richtige Pronomen im Dativ! 48 Sätze.
              </p>
              <div className="flex gap-1 mt-4 flex-wrap">
                <span className="text-rose-400 font-bold text-xs px-1.5 py-0.5 bg-rose-400/10 rounded">mir</span>
                <span className="text-amber-400 font-bold text-xs px-1.5 py-0.5 bg-amber-400/10 rounded">dir</span>
                <span className="text-blue-400 font-bold text-xs px-1.5 py-0.5 bg-blue-400/10 rounded">ihm</span>
                <span className="text-pink-400 font-bold text-xs px-1.5 py-0.5 bg-pink-400/10 rounded">ihr</span>
                <span className="text-emerald-400 font-bold text-xs px-1.5 py-0.5 bg-emerald-400/10 rounded">uns</span>
                <span className="text-violet-400 font-bold text-xs px-1.5 py-0.5 bg-violet-400/10 rounded">ihnen</span>
                <span className="text-cyan-400 font-bold text-xs px-1.5 py-0.5 bg-cyan-400/10 rounded">Ihnen</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}

export default App
