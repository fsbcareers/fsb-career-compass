interface ProgressPillProps {
  progress: number; // 0 to 1
}

const ProgressPill = ({ progress }: ProgressPillProps) => {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div className="w-full h-[5px] rounded-full bg-survey-button-border overflow-hidden">
      <div
        className="h-full rounded-full bg-primary progress-pill"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressPill;
