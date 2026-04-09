import { useState, useRef } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { icons } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { adaptText } from "@/utils/seniorText";

interface StageSelectProps {
  onSelect: (stageId: string) => void;
  classYear?: string;
}

const StageSelect = ({ onSelect, classYear }: StageSelectProps) => {
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string, size = 20) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  const handleBucketTap = (bucketId: string) => {
    setExpandedBucket((prev) => (prev === bucketId ? null : bucketId));
  };

  const handleStageTap = (stageId: string) => {
    setTapped(stageId);
    setTimeout(() => onSelect(stageId), 150);
  };

  const buckets = surveyConfig.buckets;
  const isSenior = classYear === "senior";
  const journeyWord = isSenior ? "job" : "internship";

  return (
    <div ref={containerRef} className="animate-slide-in-left">
      <p className="text-xs uppercase tracking-[0.15em] text-survey-subtitle mb-1">
        The {journeyWord} journey
      </p>
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        Where are you getting stuck?
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-[28px] bottom-[28px] w-[2px] bg-survey-pipeline-line" />

        {/* Timeline start label */}
        <div className="flex items-center pl-[6px] mb-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Beginning
          </span>
        </div>

        <div className="flex flex-col gap-[6px]">
          {buckets.map((bucket, bucketIdx) => {
            const isExpanded = expandedBucket === bucket.id;
            const bucketStages = bucket.stages.map((sid) =>
              surveyConfig.pipelineStages.find((s) => s.id === sid)!
            );

            return (
              <div key={bucket.id} className="relative">
                {/* Bucket card */}
                <button
                  onClick={() => handleBucketTap(bucket.id)}
                  style={{ touchAction: "manipulation" }}
                  className={`relative flex items-center w-full min-h-[56px] py-3 pl-[42px] pr-3 rounded-lg border transition-all duration-200 text-left
                    ${
                      isExpanded
                        ? "bg-survey-highlight-bg border-primary"
                        : expandedBucket && !isExpanded
                        ? "bg-survey-button-bg border-survey-button-border opacity-60"
                        : "bg-survey-button-bg border-survey-button-border hover:bg-survey-highlight-bg"
                    }
                  `}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[9px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full border-2 transition-all duration-200
                      ${
                        isExpanded
                          ? "bg-primary border-primary scale-125"
                          : "bg-survey-button-bg border-survey-pipeline-dot"
                      }
                    `}
                  />

                  {/* Icon */}
                  <span
                    className={`shrink-0 mr-3 transition-colors duration-150 ${
                      isExpanded ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {getIcon(bucket.icon, 22)}
                  </span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-base font-semibold leading-[1.3] text-foreground block">
                      {bucket.label}
                    </span>
                    {!isExpanded && (
                      <span className="text-[13px] leading-[1.4] text-muted-foreground block mt-0.5">
                        {bucket.description}
                      </span>
                    )}
                  </div>

                  {/* Expand indicator */}
                  <ChevronRight
                    size={16}
                    className={`shrink-0 ml-2 text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Expanded sub-options */}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    isExpanded ? "max-h-[500px] opacity-100 mt-[6px]" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-[30px] flex flex-col gap-[8px]">
                    {bucketStages.map((stage, idx) => (
                      <button
                        key={stage.id}
                        onClick={() => handleStageTap(stage.id)}
                        style={{
                          touchAction: "manipulation",
                          transitionDelay: isExpanded ? `${idx * 50}ms` : "0ms",
                        }}
                        className={`relative flex items-center w-full text-left min-h-[56px] py-3 px-4 rounded-lg border transition-all duration-150
                          ${
                            isExpanded
                              ? "translate-y-0 opacity-100"
                              : "translate-y-2 opacity-0"
                          }
                          ${
                            tapped === stage.id
                              ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                              : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
                          }
                        `}
                      >
                        {/* Mini connector dot */}
                        <div className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-survey-pipeline-dot opacity-40" />

                        <span
                          className={`shrink-0 mr-3 transition-colors duration-150 ${
                            tapped === stage.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {getIcon(stage.icon, 18)}
                        </span>
                        <span className="flex-1 text-[15px] leading-[1.4] text-foreground">
                          {stage.label}
                        </span>
                        <ChevronRight
                          size={14}
                          className="shrink-0 ml-2 text-muted-foreground"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline end label */}
        <div className="flex items-center pl-[6px] mt-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            End — {isSenior ? "Job" : "Internship"} secured 🎉
          </span>
        </div>
      </div>
    </div>
  );
};

export default StageSelect;
