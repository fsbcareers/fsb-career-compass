import { surveyConfig } from "@/config/surveyConfig";

interface StageSelectProps {
  onSelect: (stageId: string) => void;
}

const StageSelect = ({ onSelect }: StageSelectProps) => {
  return (
    <div className="animate-slide-in-left">
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Where in the internship search are you feeling the most stuck?
      </h2>
      <p className="text-sm text-survey-subtitle mb-6">
        Pick the one that feels most like your biggest barrier right now.
      </p>
      <div className="flex flex-col gap-3">
        {surveyConfig.pipelineStages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className="w-full text-left min-h-[52px] py-4 px-4 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-colors text-base text-foreground"
          >
            {stage.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StageSelect;
