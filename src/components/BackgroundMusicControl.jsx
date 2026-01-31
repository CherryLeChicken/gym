import { useState } from 'react'

const MUSIC_PRESETS = [
  {
    id: 'energetic',
    label: '🔥 Energetic',
    prompt: 'High-energy electronic dance music, fast tempo, driving bassline, upbeat synth melodies, perfect for intense workout, rhythmic and continuous.'
  },
  {
    id: 'lofi',
    label: '☕ Relaxing',
    prompt: 'Chill lofi hip hop beats, mellow tempo, smooth jazzy chords, atmospheric vinyl crackle, calm and focused background music, continuous loop.'
  },
  {
    id: 'rock',
    label: '🎸 Power Rock',
    prompt: 'Powerful hard rock instrumental, distorted electric guitars, strong drum beat, motivational and driving energy, rhythmic continuous loop.'
  },
  {
    id: 'zen',
    label: '🧘 Zen Yoga',
    prompt: 'Peaceful ambient meditation music, soft pads, ethereal flutes, slow tempo, calming and spacious atmosphere, continuous flowing instrumental.'
  }
]

export default function BackgroundMusicControl({ 
  playMusic, 
  stopMusic, 
  togglePlay,
  updateVolume,
  toggleMute,
  isMuted,
  volume,
  isPlaying, 
  isLoading, 
  error,
  currentPrompt,
  audioData
}) {
  const [customPrompt, setCustomPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customPrompt.trim()) {
      playMusic(customPrompt)
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <h3 className="font-display font-semibold text-slate-200">Background Music</h3>
        </div>
        <div className="flex items-end gap-[3px] h-6 px-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
          {(isPlaying && audioData && audioData.length > 0) ? (
            Array.from(audioData).slice(0, 12).map((val, i) => {
              const height = Math.max(10, (val / 255) * 100);
              const opacity = 0.4 + (val / 255) * 0.6;
              return (
                <div 
                  key={i}
                  className="w-1.5 bg-cyan-400 rounded-full transition-all duration-100 ease-out"
                  style={{ 
                    height: `${height}%`,
                    opacity: opacity,
                    boxShadow: val > 128 ? '0 0 8px rgba(34, 211, 238, 0.5)' : 'none'
                  }}
                ></div>
              );
            })
          ) : (
            // Placeholder bars when not playing
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-[10%] bg-slate-800 rounded-full"></div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="py-6 px-4 bg-slate-950/40 rounded-2xl border border-cyan-500/20 text-center space-y-4">
            <div className="relative flex justify-center">
              <div className="relative animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-display font-bold text-cyan-400">Composing Audio...</p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Generating your custom track (approx. 15s)
              </p>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-cyan-500 animate-loading-progress"></div>
            </div>
          </div>
        )}

        {/* Presets Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {MUSIC_PRESETS.map((preset) => {
                const isSelected = currentPrompt === preset.prompt;
                return (
                  <button
                    key={preset.id}
                    onClick={() => playMusic(preset.prompt)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all text-center border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Volume control always available under options */}
            <div className="bg-slate-950/30 rounded-xl p-3 border border-slate-800/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={toggleMute}
                  className="text-[10px] text-slate-500 uppercase tracking-wider font-bold hover:text-cyan-500 transition-colors"
                >
                  {isMuted ? '🔇 Muted' : '🔊 Master Volume'}
                </button>
                <span className="text-[10px] text-cyan-500 font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => updateVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </>
        )}

        {/* Custom Prompt Input */}
        {!currentPrompt && !isLoading && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Or type your own vibe..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 px-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!customPrompt.trim()}
              className="w-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 text-slate-400 py-2 px-4 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
            >
              Generate Custom
            </button>
          </form>
        )}

        {/* Always show volume and visualizer if we have a prompt (even if loading or paused) */}
        {currentPrompt && !isLoading && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all text-xl ${
                    isLoading 
                      ? 'bg-slate-800/50 border-slate-700 text-slate-600' 
                      : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? '...' : isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  disabled={isLoading}
                  className={`w-12 h-8 flex items-center justify-center rounded-lg border transition-all text-lg ${
                    isMuted 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-cyan-400'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {isMuted ? 'Muted' : 'Volume'}
                  </span>
                  <span className="text-[10px] text-cyan-500 font-mono">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => updateVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={stopMusic}
                  className="text-[10px] text-red-400/70 hover:text-red-400 uppercase tracking-widest font-bold transition-colors"
                >
                  Stop
                </button>
                <button
                  type="button"
                  onClick={stopMusic}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 uppercase tracking-widest font-bold transition-colors"
                >
                  ← Change Vibe
                </button>
              </div>
              <span className="text-[10px] text-slate-600 italic truncate max-w-[100px]">
                {currentPrompt.length > 30 ? 'Custom Preset' : currentPrompt}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-xs text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
          ⚠️ {error}
        </p>
      )}

      <p className="mt-6 text-[9px] text-slate-600 uppercase tracking-[0.2em] text-center font-bold">
        ElevenLabs AI Audio
      </p>
    </div>
  )
}
