export default function FeedbackDisplay({ feedback }) {
  if (!feedback) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 min-h-[120px] flex items-center justify-center">
        <p className="text-[#FDF8FF] text-center font-body">
          Feedback will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 min-h-[120px]">
      <h3 className="font-display text-sm font-semibold mb-3 text-[#FDF8FF] uppercase tracking-wide">
        Live Feedback
      </h3>
      <p className="text-cyan-400 font-body text-lg leading-relaxed">
        {feedback}
      </p>
    </div>
  );
}
