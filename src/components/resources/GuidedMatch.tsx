import { useState } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { adaptText } from "@/utils/seniorText";
import { getLabel } from "@/utils/labelMap";
import { icons, ChevronRight, Pencil } from "lucide-react";

interface GuidedAnswers {
  year: string;
  stage: string;
  detail: string;
}

interface GuidedMatchProps {
  initial?: Partial<GuidedAnswers>;
  onComplete: (answers: GuidedAnswers) => void;
  onChange?: () => void;
  /** When true, renders the compact summary bar instead of the full questionnaire. */
  collapsed?: boolean;
  current?: GuidedAnswers | null;
}

const YEARS = [
  { id: "freshman", label: "Freshman", emoji: "🌱" },
  { id: "sophomore", label: "Sophomore", emoji: "📚" },
  { id: "junior", label: "Junior", emoji: "🚀" },
  { id: "senior", label: "Senior", emoji: "🎓" },
];

const getIcon = (name: string, size = 20) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon size={size} /> : null;
};

const GuidedMatch = ({
  initial,
  onComplete,
  onChange,
  collapsed,
  current,
}: GuidedMatchProps) => {
  const [step, setStep] = useState<"year" | "stage" | "detail">(
    initial?.year ? (initial?.stage ? "detail" : "stage") : "year"
  );
  const [year, setYear] = useState(initial?.year ?? "");
  const [stage, setStage] = useState(initial?.stage ?? "");
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  // Compact summary bar when matched results are shown
  if (collapsed && current) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-foreground">
          <span className="text-muted-foreground">Showing for:</span>
          <span className="font-medium">{getLabel(current.year)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-medium">{getLabel(current.stage)}</span>
          {current.detail && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="font-medium">{getLabel(current.detail)}</span>
            </>
          )}
        </div>
        <button
          onClick={onChange}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Pencil className="h-3 w-3" /> Change
        </button>
      </div>
    );
  }

  // Step 1: Year
  if (step === "year") {
    return (
      <div className="animate-fade-in">
        <h2 className="mb-1 text-[20px] font-semibold leading-tight text-foreground">
          What year are you?
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Two quick questions to find resources matched to you.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {YEARS.map((y) => (
            <button
              key={y.id}
              onClick={() => {
                setYear(y.id);
                setStep("stage");
              }}
              style={{ touchAction: "manipulation" }}
              className="flex min-h-[88px] flex-col items-center justify-center rounded-xl border-2 border-survey-button-border bg-survey-button-bg py-4 text-foreground transition-all hover:bg-survey-button-hover active:scale-[0.97]"
            >
              <span className="mb-1 text-2xl">{y.emoji}</span>
              <span className="text-base font-semibold">{y.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Bucket → Stage (mirrors StageSelect)
  if (step === "stage") {
    return (
      <div className="animate-fade-in">
        <h2 className="mb-4 text-[20px] font-semibold leading-tight text-foreground">
          Where are you in the process?
        </h2>
        <div className="flex flex-col gap-2">
          {surveyConfig.buckets.map((bucket) => {
            const isExpanded = expandedBucket === bucket.id;
            const stages = bucket.stages.map(
              (sid) => surveyConfig.pipelineStages.find((s) => s.id === sid)!
            );
            const isAlreadyDone = bucket.id === "already_done";
            return (
              <div key={bucket.id}>
                <button
                  onClick={() => setExpandedBucket((p) => (p === bucket.id ? null : bucket.id))}
                  style={{ touchAction: "manipulation" }}
                  className={`flex min-h-[56px] w-full items-center rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.97] ${
                    isExpanded
                      ? isAlreadyDone
                        ? "border-[hsl(160_60%_40%)] bg-[hsl(155_40%_93%)]"
                        : "border-primary bg-survey-highlight-bg"
                      : isAlreadyDone
                      ? "border-[hsl(160_30%_75%)] bg-[hsl(155_40%_95%)]"
                      : "border-survey-button-border bg-survey-button-bg hover:bg-survey-highlight-bg"
                  }`}
                >
                  <span
                    className={`mr-3 shrink-0 ${
                      isAlreadyDone
                        ? "text-[hsl(160_60%_40%)]"
                        : isExpanded
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {getIcon(bucket.icon, 22)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-foreground">
                      {bucket.label}
                    </span>
                    {!isExpanded && (
                      <span className="mt-0.5 block text-[13px] text-muted-foreground">
                        {bucket.description}
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className={`ml-2 shrink-0 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    isExpanded ? "mt-2 max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-2 pl-4">
                    {stages.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setStage(s.id);
                          setExpandedBucket(null);
                          setStep("detail");
                        }}
                        style={{ touchAction: "manipulation" }}
                        className="flex min-h-[56px] w-full items-center rounded-xl border-2 border-survey-button-border bg-survey-button-bg px-4 py-3 text-left text-foreground transition-all hover:bg-survey-button-hover active:scale-[0.96]"
                      >
                        <span className="mr-3 shrink-0 text-muted-foreground">
                          {getIcon(s.icon, 18)}
                        </span>
                        <span className="flex-1 text-[15px]">{adaptText(s.label, year)}</span>
                        <ChevronRight size={14} className="ml-2 shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => onComplete({ year, stage: "", detail: "" })}
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Skip — just show me everything
        </button>
      </div>
    );
  }

  // Step 3: Detail (drilldown)
  const stageObj = surveyConfig.pipelineStages.find((s) => s.id === stage);
  if (!stageObj) {
    onComplete({ year, stage, detail: "" });
    return null;
  }

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4 text-[20px] font-semibold leading-tight text-foreground">
        {adaptText(stageObj.drilldownQuestion, year)}
      </h2>
      <div className="flex flex-col gap-2">
        {stageObj.drilldownBuckets.map((b) => {
          const isExpanded = expandedBucket === b.id;
          const opts = b.options.map(
            (oid) => stageObj.drilldownOptions.find((o) => o.id === oid)!
          );
          return (
            <div key={b.id}>
              <button
                onClick={() => setExpandedBucket((p) => (p === b.id ? null : b.id))}
                style={{ touchAction: "manipulation" }}
                className={`flex min-h-[56px] w-full items-center rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.97] ${
                  isExpanded
                    ? "border-primary bg-survey-highlight-bg"
                    : "border-survey-button-border bg-survey-button-bg hover:bg-survey-highlight-bg"
                }`}
              >
                <span className={`mr-3 shrink-0 ${isExpanded ? "text-primary" : "text-muted-foreground"}`}>
                  {getIcon(b.icon, 22)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">{b.label}</span>
                  {!isExpanded && (
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">
                      {b.description}
                    </span>
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className={`ml-2 shrink-0 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  isExpanded ? "mt-2 max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2 pl-4">
                  {opts.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => onComplete({ year, stage, detail: o.id })}
                      style={{ touchAction: "manipulation" }}
                      className="flex min-h-[56px] w-full items-center rounded-xl border-2 border-survey-button-border bg-survey-button-bg px-4 py-3 text-left transition-all hover:bg-survey-button-hover active:scale-[0.96]"
                    >
                      <span className="mr-3 shrink-0 text-muted-foreground">{getIcon(o.icon)}</span>
                      <span className="flex-1 text-[15px] text-foreground">
                        {adaptText(o.label, year)}
                      </span>
                      <ChevronRight size={14} className="ml-2 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => onComplete({ year, stage, detail: "" })}
        className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Skip this step — show matches for {getLabel(stage)}
      </button>
    </div>
  );
};

export default GuidedMatch;