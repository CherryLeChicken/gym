export default function ExerciseSelector({ selectedExercise, onSelect, disabled }) {
  const exercises = [
    { id: 'squat', name: 'Squat', icon: '🏋️' },
    { id: 'push-up', name: 'Push-up', icon: '💪' }
  ]

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
      <h2 className="font-display text-xl font-semibold mb-4 text-slate-200">
        Select Exercise
      </h2>
      <div className="space-y-3">
        {exercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise.id)}
            disabled={disabled}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedExercise === exercise.id
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exercise.icon}</span>
              <span className="font-body font-medium text-slate-200 capitalize">
                {exercise.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
