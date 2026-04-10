import { useState, useEffect } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { icons, CheckCircle } from "lucide-react";
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
      <div className="flex flex-col gap-[10px]">
        {question.options.map((option) => (
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

export default FollowUpQuestion;
