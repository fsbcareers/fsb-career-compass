import { surveyConfig } from "@/config/surveyConfig";
import { adaptText } from "@/utils/seniorText";

interface ConfirmationProps {
  stageId: string;
  onRestart: () => void;
  classYear?: string;
}

const confettiEmojis = ["🎉", "✨", "🙌", "💪", "⭐"];

const Confirmation = ({ stageId, onRestart, classYear }: ConfirmationProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId);

  return (
    <div className="animate-fade-in text-center pt-6">
      {/* Emoji confetti row */}
      <div className="flex justify-center gap-3 mb-5">
        {confettiEmojis.map((emoji, i) => (
          <span
            key={i}
            className="text-2xl animate-emoji-pop"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-survey-highlight-bg flex items-center justify-center">
          <svg className="w-9 h-9" viewBox="0 0 32 32">
            <path
              className="stroke-primary fill-none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 17l5 5 11-11"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: "check-draw 0.5s 0.3s ease-out forwards",
              }}
            />
          </svg>
        </div>
      </div>

      <h2 className="text-[24px] font-bold text-foreground mb-3 leading-[1.3]">
        You're awesome — thank you! 🎯
      </h2>

      {stage && (
        <p className="text-base text-muted-foreground mb-8 leading-[1.5] max-w-[320px] mx-auto">
          {adaptText(stage.resourceNudge, classYear)}
        </p>
      )}

      <button
        onClick={onRestart}
        style={{ touchAction: "manipulation" }}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 min-h-[44px] min-w-[44px] active:scale-95"
      >
        Take it again
      </button>
    </div>
  );
};

export default Confirmation;
