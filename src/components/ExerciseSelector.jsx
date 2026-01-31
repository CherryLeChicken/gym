// All available exercises with their targets and equipment requirements
const ALL_EXERCISES = [
  // Legs exercises
  { id: "squat", name: "Squat", icon: "🏋️", targets: ["legs", "full-body", "cardio"], equipment: ["none"] },
  { id: "lunge", name: "Lunges", icon: "🚶", targets: ["legs", "cardio"], equipment: ["none"] },
  { id: "calf-raise", name: "Calf Raises", icon: "🦵", targets: ["legs"], equipment: ["none"] },
  { id: "wall-sit", name: "Wall Sit", icon: "🧘", targets: ["legs"], equipment: ["none"] },
  { id: "step-up", name: "Step-ups", icon: "📈", targets: ["legs", "cardio"], equipment: ["chair-bench"] },
  { id: "jump-squat", name: "Jump Squats", icon: "⚡", targets: ["legs", "cardio", "full-body"], equipment: ["none"] },
  { id: "goblet-squat", name: "Goblet Squat", icon: "🏋️", targets: ["legs", "full-body"], equipment: ["dumbbells"] },
  
  // Arms exercises
  { id: "push-up", name: "Push-up", icon: "💪", targets: ["arms", "upper-body", "core", "full-body", "cardio"], equipment: ["none"] },
  { id: "tricep-dip", name: "Tricep Dips", icon: "💪", targets: ["arms", "upper-body"], equipment: ["chair-bench"] },
  { id: "arm-circles", name: "Arm Circles", icon: "🌀", targets: ["arms", "upper-body"], equipment: ["none"] },
  { id: "diamond-pushup", name: "Diamond Push-ups", icon: "💎", targets: ["arms", "upper-body", "core"], equipment: ["none"] },
  { id: "bicep-curl", name: "Bicep Curls", icon: "💪", targets: ["arms"], equipment: ["dumbbells", "resistance-bands"] },
  { id: "tricep-extension", name: "Tricep Extensions", icon: "💪", targets: ["arms"], equipment: ["dumbbells", "resistance-bands"] },
  { id: "shoulder-press", name: "Shoulder Press", icon: "🏋️", targets: ["arms", "upper-body"], equipment: ["dumbbells", "resistance-bands"] },
  
  // Upper Body exercises
  { id: "chest-press", name: "Chest Press", icon: "💪", targets: ["upper-body"], equipment: ["dumbbells", "resistance-bands"] },
  { id: "pull-apart", name: "Band Pull-aparts", icon: "🎯", targets: ["upper-body"], equipment: ["resistance-bands"] },
  { id: "lateral-raise", name: "Lateral Raises", icon: "✋", targets: ["upper-body"], equipment: ["dumbbells", "resistance-bands"] },
  { id: "rows", name: "Rows", icon: "🚣", targets: ["upper-body"], equipment: ["dumbbells", "resistance-bands"] },
  
  // Core exercises
  { id: "plank", name: "Plank", icon: "🔥", targets: ["core", "full-body"], equipment: ["none"] },
  { id: "crunch", name: "Crunches", icon: "🔥", targets: ["core"], equipment: ["none"] },
  { id: "russian-twist", name: "Russian Twists", icon: "🔥", targets: ["core"], equipment: ["none"] },
  { id: "leg-raise", name: "Leg Raises", icon: "🔥", targets: ["core"], equipment: ["none"] },
  { id: "mountain-climber", name: "Mountain Climbers", icon: "⛰️", targets: ["core", "cardio", "full-body"], equipment: ["none"] },
  { id: "dead-bug", name: "Dead Bug", icon: "🐛", targets: ["core"], equipment: ["none"] },
  { id: "side-plank", name: "Side Plank", icon: "🔥", targets: ["core", "upper-body"], equipment: ["none"] },
  { id: "weighted-crunch", name: "Weighted Crunches", icon: "🔥", targets: ["core"], equipment: ["dumbbells"] },
  
  // Cardio exercises
  { id: "jumping-jacks", name: "Jumping Jacks", icon: "❤️", targets: ["cardio", "full-body"], equipment: ["none"] },
  { id: "high-knees", name: "High Knees", icon: "❤️", targets: ["cardio", "legs"], equipment: ["none"] },
  { id: "burpee", name: "Burpees", icon: "💥", targets: ["cardio", "full-body"], equipment: ["none"] },
  { id: "jump-rope", name: "Jump Rope (simulated)", icon: "🪢", targets: ["cardio", "legs"], equipment: ["none"] },
  
  // Full Body exercises
  { id: "squat-press", name: "Squat to Press", icon: "🏋️", targets: ["full-body", "legs", "upper-body"], equipment: ["dumbbells"] },
  { id: "deadlift", name: "Deadlift", icon: "🏋️", targets: ["full-body", "legs", "upper-body"], equipment: ["dumbbells"] },
  { id: "thruster", name: "Thrusters", icon: "💥", targets: ["full-body", "legs", "upper-body", "cardio"], equipment: ["dumbbells"] },
  { id: "bear-crawl", name: "Bear Crawl", icon: "🐻", targets: ["full-body", "core", "cardio"], equipment: ["none"] },
];

// Map workout types from onboarding to exercise targets
const WORKOUT_TYPE_MAP = {
  "legs": ["legs"],
  "arms": ["arms"],
  "upper-body": ["upper-body"],
  "core": ["core"],
  "cardio": ["cardio"],
  "full-body": ["full-body"]
};

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

export default function ExerciseSelector({ selectedExercise, onSelect, onHover, disabled, workoutType, equipment, onPreferencesUpdate }) {
  const [showSettings, setShowSettings] = useState(false)
  const [tempWorkoutType, setTempWorkoutType] = useState(workoutType || '')
  const [tempEquipment, setTempEquipment] = useState(equipment || '')

  // Filter exercises based on selected workout type and equipment
  let exercises = ALL_EXERCISES;
  
  // Filter by workout type
  if (workoutType) {
    const targetTypes = WORKOUT_TYPE_MAP[workoutType] || []
    exercises = exercises.filter(exercise => 
      exercise.targets.some(target => targetTypes.includes(target))
    )
  }
  
  // Filter by equipment
  if (equipment) {
    exercises = exercises.filter(exercise => 
      exercise.equipment.includes(equipment)
    )
  }
  
  const handleSavePreferences = () => {
    // Get existing onboarding data
    const existingData = JSON.parse(localStorage.getItem('onboarding') || '{}')
    
    // Update only workout type and equipment
    const updatedData = {
      ...existingData,
      workoutType: tempWorkoutType,
      equipment: tempEquipment
    }
    
    localStorage.setItem('onboarding', JSON.stringify(updatedData))
    
    // Notify parent to update
    if (onPreferencesUpdate) {
      onPreferencesUpdate(updatedData)
    }
    
    setShowSettings(false)
  }

  // If no exercises match, show a message
  if (exercises.length === 0 && !showSettings) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-[#FDF8FF]">
            Select Exercise
          </h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Edit Preferences"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-400 mb-2">No exercises match your preferences.</p>
          <p className="text-sm text-slate-500">Try adjusting your workout type or equipment in settings.</p>
        </div>
      </div>
    )
  }

  if (showSettings) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-[#FDF8FF]">
            Edit Preferences
          </h2>
          <button
            onClick={() => {
              setShowSettings(false)
              setTempWorkoutType(workoutType || '')
              setTempEquipment(equipment || '')
            }}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Cancel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Workout Type Selection */}
          <div>
            <label className="block text-[#FDF8FF] font-body font-semibold mb-3">
              Workout Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WORKOUT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    tempWorkoutType === type.value
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="workoutType"
                    value={type.value}
                    checked={tempWorkoutType === type.value}
                    onChange={(e) => setTempWorkoutType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-1">{type.icon}</span>
                  <span className="text-xs font-display font-semibold text-center">{type.label}</span>
                  {tempWorkoutType === type.value && (
                    <div className="absolute top-1 right-1">
                      <span className="text-cyan-400 text-xs">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-[#FDF8FF] font-body font-semibold mb-3">
              Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {EQUIPMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    tempEquipment === option.value
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="equipment"
                    value={option.value}
                    checked={tempEquipment === option.value}
                    onChange={(e) => setTempEquipment(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-1">{option.icon}</span>
                  <span className="text-xs font-display font-semibold text-center">{option.label}</span>
                  {tempEquipment === option.value && (
                    <div className="absolute top-1 right-1">
                      <span className="text-cyan-400 text-xs">✓</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSavePreferences}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-display font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Save Preferences
            </button>
            <button
              onClick={() => {
                setShowSettings(false)
                setTempWorkoutType(workoutType || '')
                setTempEquipment(equipment || '')
              }}
              className="px-4 py-3 bg-slate-800/50 border-2 border-slate-700 text-slate-300 rounded-xl hover:border-slate-600 transition-all font-display font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-[#FDF8FF]">
          Select Exercise
        </h2>
        <button
          onClick={() => {
            setTempWorkoutType(workoutType || '')
            setTempEquipment(equipment || '')
            setShowSettings(true)
          }}
          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Edit Preferences"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise.id)}
            onMouseEnter={() => {
              if (!disabled && onHover) {
                console.log('Mouse enter on exercise:', exercise.id)
                onHover(exercise.id)
              }
            }}
            onMouseLeave={() => {
              if (!disabled && onHover) {
                console.log('Mouse leave on exercise')
                onHover(null)
              }
            }}
            disabled={disabled}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedExercise === exercise.id
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exercise.icon}</span>
              <span className="font-body font-medium text-[#FBF8FF] capitalize">
                {exercise.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
