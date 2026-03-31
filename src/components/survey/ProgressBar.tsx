interface ProgressBarProps {
  progress: number; // 0 to 1
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="w-full h-[3px] bg-survey-button-border">
      <div
        className="h-full bg-survey-progress transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
