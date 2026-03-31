import { surveyConfig, type PipelineStage } from "@/config/surveyConfig";

interface DrilldownSelectProps {
  stageId: string;
  onSelect: (optionId: string) => void;
}

const DrilldownSelect = ({ stageId, onSelect }: DrilldownSelectProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId) as PipelineStage;

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {stage.drilldownQuestion}
      </h2>
      <div className="flex flex-col gap-3">
        {stage.drilldownOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="w-full text-left min-h-[52px] py-4 px-4 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-colors text-base text-foreground"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrilldownSelect;
