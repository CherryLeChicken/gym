import { useState } from 'react'

const WORKOUT_TYPES = [
  { value: 'legs', label: 'Legs', icon: '🦵' },
  { value: 'arms', label: 'Arms', icon: '💪' },
  { value: 'upper-body', label: 'Upper Body', icon: '🏋️' },
  { value: 'core', label: 'Core', icon: '🔥' },
  { value: 'cardio', label: 'Cardio', icon: '❤️' },
  { value: 'full-body', label: 'Full Body', icon: '🌟' }
]

const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'No equipment', icon: '🙌' },
  { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
  { value: 'resistance-bands', label: 'Resistance bands', icon: '🎯' },
  { value: 'chair-bench', label: 'Chair / bench', icon: '🪑' }
]

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('')
  const [workoutType, setWorkoutType] = useState('')
  const [equipment, setEquipment] = useState([])
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!workoutType) {
      newErrors.workoutType = 'Please select a workout type'
    }
    if (equipment.length === 0) {
      newErrors.equipment = 'Please select at least one equipment option'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Store onboarding data in localStorage
    const onboardingData = {
      name: name.trim(),
      workoutType,
      equipment,
      completedAt: new Date().toISOString()
    }
    localStorage.setItem('onboarding', JSON.stringify(onboardingData))
    
    // Call completion callback
    onComplete(onboardingData)
  }

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center px-4 py-8">
      {/* Background texture overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="zalando-sans-expanded text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-[#00F5FF] via-[#76FFF6] to-[#FF00FF] bg-clip-text text-transparent">
            CHIN UP
          </h1>
          <p className="text-[#FDF8FF] text-lg font-body mb-2">
            Let's personalize your fitness journey
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 space-y-8">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-[#FDF8FF] font-body font-semibold mb-3">
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-xl text-[#FDF8FF] placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-body"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Workout Type Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[#FDF8FF] font-body font-semibold">
                What kind of workout do you want?
              </label>
              <button
                type="button"
                onClick={() => {
                  const randomType = WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)]
                  setWorkoutType(randomType.value)
                  if (errors.workoutType) setErrors({ ...errors, workoutType: '' })
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500 transition-all text-sm font-display font-semibold flex items-center gap-2"
              >
                <span>🎲</span>
                <span>Surprise Me</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WORKOUT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    workoutType === type.value
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="workoutType"
                    value={type.value}
                    checked={workoutType === type.value}
                    onChange={(e) => {
                      setWorkoutType(e.target.value)
                      if (errors.workoutType) setErrors({ ...errors, workoutType: '' })
                    }}
                    className="sr-only"
                  />
                  <span className="text-3xl mb-2">{type.icon}</span>
                  <span className="text-sm font-display font-semibold text-center">{type.label}</span>
                  {workoutType === type.value && (
                    <div className="absolute top-2 right-2">
                      <span className="text-cyan-400">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.workoutType && (
              <p className="mt-2 text-sm text-red-400">{errors.workoutType}</p>
            )}
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-[#FDF8FF] font-body font-semibold mb-3">
              What equipment do you have? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EQUIPMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    equipment.includes(option.value)
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="equipment"
                    value={option.value}
                    checked={equipment.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEquipment([...equipment, option.value])
                      } else {
                        setEquipment(equipment.filter(eq => eq !== option.value))
                      }
                      if (errors.equipment) setErrors({ ...errors, equipment: '' })
                    }}
                    className="sr-only"
                  />
                  <span className="text-3xl mb-2">{option.icon}</span>
                  <span className="text-xs font-display font-semibold text-center">{option.label}</span>
                  {equipment.includes(option.value) && (
                    <div className="absolute top-2 right-2">
                      <span className="text-cyan-400">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.equipment && (
              <p className="mt-2 text-sm text-red-400">{errors.equipment}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-display font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  )
}
