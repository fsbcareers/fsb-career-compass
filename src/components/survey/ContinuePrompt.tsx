interface ContinuePromptProps {
  prompt: string;
  onContinue: () => void;
  onDone: () => void;
}

const ContinuePrompt = ({ prompt, onContinue, onDone }: ContinuePromptProps) => {
  return (
    <div className="animate-slide-in-left">
      <h2 className="text-xl font-semibold text-foreground mb-8 text-center">
        {prompt}
      </h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={onContinue}
          className="w-full min-h-[52px] py-4 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-base hover:opacity-90 transition-opacity"
        >
          Sure, keep going
        </button>
        <button
          onClick={onDone}
          className="w-full min-h-[52px] py-4 px-4 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-colors text-base text-survey-subtitle"
        >
          I'm done
        </button>
      </div>
    </div>
  );
};

export default ContinuePrompt;
