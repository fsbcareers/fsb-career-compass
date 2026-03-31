import { surveyConfig } from "@/config/surveyConfig";

interface ConfirmationProps {
  stageId: string;
  onRestart: () => void;
}

const Confirmation = ({ stageId, onRestart }: ConfirmationProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId);

  return (
    <div className="animate-fade-in text-center">
      {/* Animated checkmark */}
      <div className="flex justify-center mb-6">
        <svg
          className="w-16 h-16"
          viewBox="0 0 52 52"
        >
          <circle
            className="stroke-primary fill-none"
            cx="26"
            cy="26"
            r="24"
            strokeWidth="2"
            opacity="0.2"
          />
          <path
            className="stroke-primary fill-none animate-check-draw"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l8 8 16-16"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation: "check-draw 0.5s 0.2s ease-out forwards",
            }}
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-4">
        Thanks — you're helping us help students like you.
      </h2>

      {stage && (
        <p className="text-base text-survey-subtitle mb-8 leading-relaxed">
          {stage.resourceNudge}
        </p>
      )}

      <button
        onClick={onRestart}
        className="text-sm text-survey-subtitle hover:text-foreground transition-colors underline underline-offset-4"
      >
        Start over
      </button>
    </div>
  );
};

export default Confirmation;
