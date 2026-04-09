import { useState } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { icons } from "lucide-react";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface StageSelectProps {
  onSelect: (stageId: string) => void;
}

const StageSelect = ({ onSelect }: StageSelectProps) => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const getIcon = (iconName: string, size = 20) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  const handleBucketTap = (bucketId: string) => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedBucket(bucketId);
      setAnimating(false);
    }, 150);
  };

  const handleBack = () => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedBucket(null);
      setAnimating(false);
    }, 150);
  };

  const handleStageTap = (stageId: string) => {
    setTapped(stageId);
    setTimeout(() => onSelect(stageId), 150);
  };

  const bucket = selectedBucket
    ? surveyConfig.buckets.find((b) => b.id === selectedBucket)
    : null;

  const bucketStages = bucket
    ? bucket.stages.map((sid) =>
        surveyConfig.pipelineStages.find((s) => s.id === sid)!
      )
    : [];

  // Screen 2a — Bucket grid
  if (!selectedBucket) {
    return (
      <div className={animating ? "opacity-0 transition-opacity duration-150" : "animate-fade-in"}>
        <p className="text-xs uppercase tracking-[0.15em] text-survey-subtitle mb-1">
          The internship journey
        </p>
        <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
          Where are you getting stuck?
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {surveyConfig.buckets.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBucketTap(b.id)}
              style={{ touchAction: "manipulation" }}
              className="flex flex-col items-center text-center p-5 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-all duration-150 active:scale-[0.97]"
            >
              <span className="text-primary mb-3">
                {getIcon(b.icon, 28)}
              </span>
              <span className="text-base font-semibold text-foreground leading-[1.3] mb-1">
                {b.label}
              </span>
              <span className="text-[13px] leading-[1.4] text-muted-foreground">
                {b.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 2b — Sub-options within selected bucket
  return (
    <div className={animating ? "opacity-0 transition-opacity duration-150" : "animate-fade-in"}>
      {/* Compact bucket header */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft size={14} />
        <span>Change</span>
      </button>

      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <span className="text-primary">{getIcon(bucket!.icon, 22)}</span>
        <div>
          <p className="text-base font-semibold text-foreground leading-[1.3]">
            {bucket!.label}
          </p>
          <p className="text-[13px] text-muted-foreground leading-[1.3]">
            {bucket!.description}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Which best describes where you're stuck?
      </p>

      <div className="flex flex-col gap-[10px]">
        {bucketStages.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => handleStageTap(stage.id)}
            style={{
              touchAction: "manipulation",
              animationDelay: `${idx * 50}ms`,
            }}
            className={`flex items-center w-full text-left min-h-[56px] py-4 px-4 rounded-lg border transition-all duration-150 animate-fade-in opacity-0 [animation-fill-mode:forwards]
              ${
                tapped === stage.id
                  ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                  : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
              }
            `}
          >
            <span
              className={`shrink-0 mr-3 transition-colors duration-150 ${
                tapped === stage.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {getIcon(stage.icon)}
            </span>
            <span className="flex-1 text-base leading-[1.4] text-foreground">
              {stage.label}
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 ml-2 text-muted-foreground"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StageSelect;
