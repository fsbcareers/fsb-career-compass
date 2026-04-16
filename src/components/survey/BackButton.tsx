import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
}

const BackButton = ({ onBack }: BackButtonProps) => {
  return (
    <button
      onClick={onBack}
      style={{ touchAction: "manipulation" }}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 min-h-[44px] min-w-[44px] active:scale-95"
    >
      <ChevronLeft size={16} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
