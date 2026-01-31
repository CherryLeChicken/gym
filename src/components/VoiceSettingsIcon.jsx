import { useState, useRef, useEffect } from 'react'
import { VOICE_PERSONALITY, VOICE_GENDER } from '../hooks/useVoiceFeedback'
import { useVoiceFeedback } from '../hooks/useVoiceFeedback'

const PERSONALITIES = [
  { value: VOICE_PERSONALITY.CALM, label: 'Calm', icon: '🧘' },
  { value: VOICE_PERSONALITY.NEUTRAL, label: 'Neutral', icon: '🎯' },
  { value: VOICE_PERSONALITY.ENERGETIC, label: 'Energetic', icon: '⚡' }
]

const GENDERS = [
  { value: VOICE_GENDER.MALE, label: 'Male', icon: '👨' },
  { value: VOICE_GENDER.FEMALE, label: 'Female', icon: '👩' }
]

const PREVIEW_PHRASES = {
  [VOICE_PERSONALITY.CALM]: "Nice and steady. Take your time.",
  [VOICE_PERSONALITY.NEUTRAL]: "Good form. Keep your back straight.",
  [VOICE_PERSONALITY.ENERGETIC]: "Yes! That's it!"
}

export default function VoiceSettingsIcon({ personality, gender, onPersonalitySelect, onGenderSelect }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { speak } = useVoiceFeedback(personality, gender)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handlePreview = (newPersonality, newGender) => {
    const phrase = PREVIEW_PHRASES[newPersonality] || PREVIEW_PHRASES[VOICE_PERSONALITY.NEUTRAL]
    speak(phrase, null, null, null).catch(err => console.error('Preview error:', err))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-3 bg-slate-900/80 backdrop-blur-sm rounded-xl border-2 border-slate-700 hover:border-cyan-500 transition-all text-slate-300 hover:text-cyan-400"
        title="Voice Settings"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-800 p-4 shadow-xl z-50">
          <div className="space-y-4">
            {/* Gender Selection */}
            <div>
              <div className="text-xs text-slate-400 mb-2 font-body">Voice Gender</div>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => {
                      onGenderSelect(g.value)
                      handlePreview(personality, g.value)
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                      gender === g.value
                        ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{g.icon}</span>
                      <span className="text-xs font-semibold">{g.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Selection */}
            <div>
              <div className="text-xs text-slate-400 mb-2 font-body">Personality</div>
              <div className="space-y-2">
                {PERSONALITIES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => {
                      onPersonalitySelect(p.value)
                      handlePreview(p.value, gender)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      personality === p.value
                        ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-sm font-semibold">{p.label}</span>
                      {personality === p.value && <span className="ml-auto text-cyan-400">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
