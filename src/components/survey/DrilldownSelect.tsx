import { useState } from "react";
import { surveyConfig, type PipelineStage } from "@/config/surveyConfig";
import { icons } from "lucide-react";
import { adaptText } from "@/utils/seniorText";

interface DrilldownSelectProps {
  stageId: string;
  onSelect: (optionId: string) => void;
  classYear?: string;
}

const DrilldownSelect = ({ stageId, onSelect, classYear }: DrilldownSelectProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId) as PipelineStage;
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (optionId: string) => {
    setTapped(optionId);
    setTimeout(() => onSelect(optionId), 150);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={18} /> : null;
  };

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        {adaptText(stage.drilldownQuestion, classYear)}
      </h2>
      <div className="flex flex-col gap-[10px]">
        {stage.drilldownOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleTap(option.id)}
            style={{ touchAction: "manipulation" }}
            className={`flex items-center w-full text-left min-h-[56px] py-4 px-4 rounded-lg border transition-all duration-150
              ${
                tapped === option.id
                  ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                  : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
              }
            `}
          >
            <span
              className={`shrink-0 mr-3 transition-colors duration-150 ${
                tapped === option.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {getIcon(option.icon)}
            </span>
            <span className="text-base leading-[1.4] text-foreground">
              {adaptText(option.label, classYear)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrilldownSelect;
