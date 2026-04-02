interface BackButtonProps {
  onBack: () => void;
}

const BackButton = ({ onBack }: BackButtonProps) => {
  return (
    <button
      onClick={onBack}
      style={{ touchAction: "manipulation" }}
      className="text-sm text-survey-subtitle hover:text-foreground transition-colors py-2 min-h-[44px] min-w-[44px]"
    >
      ← Back
    </button>
  );
};

export default BackButton;
