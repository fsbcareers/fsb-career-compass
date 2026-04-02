interface ContinuePromptProps {
  prompt: string;
  onContinue: () => void;
  onDone: () => void;
}

const ContinuePrompt = ({ prompt, onContinue, onDone }: ContinuePromptProps) => {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-foreground mb-8 text-center leading-[1.4]">
        {prompt}
      </h2>
      <div className="flex flex-col gap-[10px]">
        <button
          onClick={onContinue}
          style={{ touchAction: "manipulation" }}
          className="w-full min-h-[56px] py-4 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-base hover:opacity-90 transition-all duration-150 active:scale-[0.97]"
        >
          Sure, keep going
        </button>
        <button
          onClick={onDone}
          style={{ touchAction: "manipulation" }}
          className="w-full min-h-[56px] py-4 px-4 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-all duration-150 text-base text-survey-subtitle active:scale-[0.97]"
        >
          I'm done
        </button>
      </div>
    </div>
  );
};

export default ContinuePrompt;
