import { useState, lazy, Suspense } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { icons } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface StageSelectProps {
  onSelect: (stageId: string) => void;
}

const StageSelect = ({ onSelect }: StageSelectProps) => {
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (stageId: string) => {
    setTapped(stageId);
    setTimeout(() => onSelect(stageId), 150);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <div className="animate-slide-in-left">
      <p className="text-xs uppercase tracking-[0.15em] text-survey-subtitle mb-1">
        The internship journey
      </p>
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        Where are you getting stuck?
      </h2>

      <div className="relative">
        {/* Pipeline line */}
        <div className="absolute left-[15px] top-[28px] bottom-[28px] w-[2px] bg-survey-pipeline-line" />

        <div className="flex flex-col gap-[10px]">
          {surveyConfig.pipelineStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => handleTap(stage.id)}
              style={{ touchAction: "manipulation" }}
              className={`relative flex items-center w-full min-h-[56px] py-3 pl-[42px] pr-3 rounded-lg border transition-all duration-150 text-left
                ${
                  tapped === stage.id
                    ? "bg-survey-highlight-bg border-survey-pipeline-dot scale-[0.97]"
                    : "bg-survey-button-bg border-survey-button-border hover:bg-survey-highlight-bg"
                }
              `}
            >
              {/* Milestone dot */}
              <div
                className={`absolute left-[10px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full border-2 transition-colors duration-150
                  ${
                    tapped === stage.id
                      ? "bg-survey-pipeline-dot border-survey-pipeline-dot"
                      : "bg-survey-button-bg border-survey-pipeline-dot"
                  }
                `}
              />

              {/* Icon */}
              <span
                className={`shrink-0 mr-3 transition-colors duration-150 ${
                  tapped === stage.id
                    ? "text-survey-pipeline-dot"
                    : "text-muted-foreground"
                }`}
              >
                {getIcon(stage.icon)}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span className="text-base leading-[1.4] text-foreground block">
                  {stage.label}
                </span>
              </div>

              {/* Chevron */}
              <ChevronRight
                size={16}
                className="shrink-0 ml-2 text-muted-foreground"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageSelect;
