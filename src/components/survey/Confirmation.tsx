import { surveyConfig } from "@/config/surveyConfig";

interface ConfirmationProps {
  stageId: string;
  onRestart: () => void;
}

const Confirmation = ({ stageId, onRestart }: ConfirmationProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId);

  return (
    <div className="animate-fade-in text-center">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-full bg-survey-highlight-bg flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 32 32">
            <path
              className="stroke-primary fill-none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 17l5 5 11-11"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: "check-draw 0.5s 0.2s ease-out forwards",
              }}
            />
          </svg>
        </div>
      </div>

      <h2 className="text-[22px] font-semibold text-foreground mb-4 leading-[1.4]">
        Thanks — you're helping us help students like you.
      </h2>

      {stage && (
        <p className="text-base text-survey-subtitle mb-8 leading-[1.4]">
          {stage.resourceNudge}
        </p>
      )}

      <button
        onClick={onRestart}
        style={{ touchAction: "manipulation" }}
        className="text-sm text-survey-subtitle hover:text-foreground transition-colors underline underline-offset-4 min-h-[44px] min-w-[44px]"
      >
        Start over
      </button>
    </div>
  );
};

export default Confirmation;
