import { useEffect, useRef } from 'react'
import { VOICE_PERSONALITY, VOICE_GENDER } from '../hooks/useVoiceFeedback'
import { useVoiceFeedback } from '../hooks/useVoiceFeedback'

// Personality-specific phrases for voice preview
const CALM_PHRASES = [
  "Nice and steady. Take your time.",
  "That rep looked good. Focus on your breathing.",
  "You're doing great. No rush.",
  "Slow and controlled. That's the way.",
  "Breathe deeply. You've got this.",
  "Take it easy. You're doing well.",
  "Steady pace. Keep it smooth.",
  "Relax and focus. You're doing fine."
]

const NEUTRAL_PHRASES = [
  "Good form. Keep your back straight.",
  "Lower slowly, then push up.",
  "That's the right depth.",
  "Let's get this started.",
  "Focus on your technique.",
  "You're ready for this.",
  "Keep your form consistent.",
  "That's the correct movement."
]

const ENERGETIC_PHRASES = [
  "Yes! That's it!",
  "Strong rep! Keep pushing!",
  "Two more! You've got this!",
  "Let's go! Crush it!",
  "That's what I'm talking about!",
  "Keep that energy up!",
  "You're unstoppable!",
  "Time to dominate!"
]

function getRandomPhrase(personality) {
  let phrases
  switch (personality) {
    case 'calm':
      phrases = CALM_PHRASES
      break
    case 'energetic':
      phrases = ENERGETIC_PHRASES
      break
    case 'neutral':
    default:
      phrases = NEUTRAL_PHRASES
      break
  }
  return phrases[Math.floor(Math.random() * phrases.length)]
}

export default function VoicePersonalitySelector({ personality, gender, onPersonalitySelect, onGenderSelect }) {
  const { speak } = useVoiceFeedback(personality, gender)
  const prevPersonalityRef = useRef(personality)
  const prevGenderRef = useRef(gender)
  const isInitialMountRef = useRef(true)

  // Play preview when voice settings change (but not on initial mount)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      prevPersonalityRef.current = personality
      prevGenderRef.current = gender
      return
    }

    // Only play preview if personality or gender actually changed
    if (prevPersonalityRef.current !== personality || prevGenderRef.current !== gender) {
      const phrase = getRandomPhrase(personality)
      console.log('Playing voice preview after change:', { phrase, personality, gender })
      speak(phrase, null, null, null).catch(err => {
        console.error('Error playing voice preview:', err)
      })
      
      prevPersonalityRef.current = personality
      prevGenderRef.current = gender
    }
  }, [personality, gender, speak])

  // Handler for gender clicks - always play preview
  const handleGenderClick = (newGender) => {
    onGenderSelect(newGender)
    // If clicking the same gender, play preview immediately
    if (newGender === gender) {
      const phrase = getRandomPhrase(personality)
      console.log('Playing preview for same gender click:', { phrase, personality, gender })
      speak(phrase, null, null, null).catch(err => {
        console.error('Error playing voice preview:', err)
      })
    }
  }

  // Handler for personality clicks - always play preview
  const handlePersonalityClick = (newPersonality) => {
    onPersonalitySelect(newPersonality)
    // If clicking the same personality, play preview immediately
    if (newPersonality === personality) {
      const phrase = getRandomPhrase(newPersonality)
      console.log('Playing preview for same personality click:', { phrase, personality: newPersonality, gender })
      speak(phrase, null, null, null).catch(err => {
        console.error('Error playing voice preview:', err)
      })
    }
  }
  const personalities = [
    {
      value: VOICE_PERSONALITY.CALM,
      label: 'Calm',
      description: 'Gentle, measured coaching',
      icon: '🧘'
    },
    {
      value: VOICE_PERSONALITY.NEUTRAL,
      label: 'Neutral',
      description: 'Balanced, professional tone',
      icon: '🎯'
    },
    {
      value: VOICE_PERSONALITY.ENERGETIC,
      label: 'Energetic',
      description: 'Upbeat, motivating coaching',
      icon: '⚡'
    }
  ]

  const genders = [
    {
      value: VOICE_GENDER.MALE,
      label: 'Male',
      icon: '👨'
    },
    {
      value: VOICE_GENDER.FEMALE,
      label: 'Female',
      icon: '👩'
    }
  ]

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
      <h3 className="text-lg font-display font-semibold text-slate-200 mb-4">
        Voice Settings
      </h3>
      
      {/* Gender Selection */}
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2 font-body">Voice Gender</div>
        <div className="flex gap-2">
          {genders.map((g) => (
            <button
              key={g.value}
              onClick={() => handleGenderClick(g.value)}
              className={`flex-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                gender === g.value
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{g.icon}</span>
                <span className="font-display font-semibold text-sm">{g.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Personality Selection */}
      <div>
        <div className="text-sm text-slate-400 mb-2 font-body">Personality</div>
        <div className="space-y-2">
          {personalities.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePersonalityClick(p.value)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                personality === p.value
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="font-display font-semibold">{p.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.description}</div>
                </div>
                {personality === p.value && (
                  <span className="text-cyan-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
