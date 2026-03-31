import { surveyConfig } from "@/config/surveyConfig";

interface FollowUpQuestionProps {
  questionIndex: number;
  onSelect: (optionId: string) => void;
}

const FollowUpQuestion = ({ questionIndex, onSelect }: FollowUpQuestionProps) => {
  const question = surveyConfig.followUpQuestions[questionIndex];

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {question.question}
      </h2>
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
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

export default FollowUpQuestion;
