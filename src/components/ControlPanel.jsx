export default function ControlPanel({ isActive, onToggle, hasExercise }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
      <button
        onClick={() => onToggle(!isActive)}
        className={`w-full py-4 px-6 rounded-xl font-display font-semibold text-lg transition-all duration-200 ${
          isActive
            ? "bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30"
            : "bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30"
        } cursor-pointer`}
      >
        {isActive ? "⏸ Stop" : "▶ Start Detection"}
      </button>
      {!hasExercise && !isActive && (
        <p className="mt-3 text-sm text-[#FDF8FF] text-center">
          Start to test pose detection, or select an exercise for form analysis
        </p>
      )}
      {hasExercise && !isActive && (
        <p className="mt-3 text-sm text-cyan-400/70 text-center">
          Ready to analyze {hasExercise} form
        </p>
      )}
    </div>
  );
}
