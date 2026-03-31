interface BackButtonProps {
  onBack: () => void;
}

const BackButton = ({ onBack }: BackButtonProps) => {
  return (
    <button
      onClick={onBack}
      className="text-sm text-survey-subtitle hover:text-foreground transition-colors py-2"
    >
      ← Back
    </button>
  );
};

export default BackButton;
