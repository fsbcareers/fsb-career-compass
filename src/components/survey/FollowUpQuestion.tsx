import { useState, useEffect } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { icons, CheckCircle, ChevronRight } from "lucide-react";
import { adaptText } from "@/utils/seniorText";

interface FollowUpQuestionProps {
  questionIndex: number;
  onSelect: (optionId: string) => void;
  classYear?: string;
  showEncouragement?: boolean;
  onEncouragementShown?: () => void;
}

const FollowUpQuestion = ({
  questionIndex,
  onSelect,
  classYear,
  showEncouragement,
  onEncouragementShown,
}: FollowUpQuestionProps) => {
  const question = surveyConfig.followUpQuestions[questionIndex];
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (showEncouragement) {
      setBannerVisible(true);
      onEncouragementShown?.();
      const timer = setTimeout(() => setBannerVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showEncouragement, onEncouragementShown]);

  const handleBucketTap = (bucketId: string) => {
    setExpandedBucket((prev) => (prev === bucketId ? null : bucketId));
  };

  const handleOptionTap = (optionId: string) => {
    setTapped(optionId);
    setTimeout(() => onSelect(optionId), 150);
  };

  const getIcon = (iconName: string, size = 18) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  const buckets = question.buckets;

  return (
    <div className="animate-slide-in-left">
      {bannerVisible && (
        <div className="mb-4 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-survey-highlight-bg">
            <CheckCircle size={18} className="shrink-0 text-survey-highlight-text" />
            <p className="text-sm font-medium text-survey-highlight-text leading-[1.4]">
              Great — that helps a lot. One more quick one!
            </p>
          </div>
        </div>
      )}
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        {adaptText(question.question, classYear)}
      </h2>

      <div className="flex flex-col gap-[6px]">
        {buckets.map((bucket) => {
          const isExpanded = expandedBucket === bucket.id;
          const bucketOptions = bucket.options.map((oid) =>
            question.options.find((o) => o.id === oid)!
          );

          return (
            <div key={bucket.id}>
              <button
                onClick={() => handleBucketTap(bucket.id)}
                style={{ touchAction: "manipulation" }}
                className={`relative flex items-center w-full min-h-[56px] py-3 pl-4 pr-3 rounded-lg border transition-all duration-200 text-left
                  ${
                    isExpanded
                      ? "bg-survey-highlight-bg border-primary"
                      : expandedBucket && !isExpanded
                      ? "bg-survey-button-bg border-survey-button-border opacity-60"
                      : "bg-survey-button-bg border-survey-button-border hover:bg-survey-highlight-bg"
                  }
                `}
              >
                <span
                  className={`shrink-0 mr-3 transition-colors duration-150 ${
                    isExpanded ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {getIcon(bucket.icon, 22)}
                </span>
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
                <ChevronRight
                  size={16}
                  className={`shrink-0 ml-2 text-muted-foreground transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  isExpanded ? "max-h-[500px] opacity-100 mt-[6px]" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-4 flex flex-col gap-[8px]">
                  {bucketOptions.map((option, idx) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionTap(option.id)}
                      style={{
                        touchAction: "manipulation",
                        transitionDelay: isExpanded ? `${idx * 50}ms` : "0ms",
                      }}
                      className={`flex items-center w-full text-left min-h-[56px] py-3 px-4 rounded-lg border transition-all duration-150
                        ${
                          isExpanded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-0"
                        }
                        ${
                          tapped === option.id
                            ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                            : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
                        }
                      `}
                    >
                      <span
                        className={`shrink-0 mr-3 transition-colors duration-150 ${
                          tapped === option.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {getIcon(option.icon)}
                      </span>
                      <span className="flex-1 text-[15px] leading-[1.4] text-foreground">
                        {adaptText(option.label, classYear)}
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
    </div>
  );
};

export default FollowUpQuestion;
