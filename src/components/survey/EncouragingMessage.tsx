import { CheckCircle } from "lucide-react";

const EncouragingMessage = () => {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-survey-highlight-bg">
        <CheckCircle size={20} className="shrink-0 text-survey-highlight-text" />
        <p className="text-sm font-medium text-survey-highlight-text leading-[1.4]">
          You just helped us understand something important. Thank you!
        </p>
      </div>
    </div>
  );
};

export default EncouragingMessage;
