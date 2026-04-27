import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { surveyConfig } from "@/config/surveyConfig";
import { adaptText } from "@/utils/seniorText";
import { useResources } from "@/hooks/useResources";
import { getMatchedResources } from "@/utils/resourceMatcher";
import ResourceCard from "@/components/resources/ResourceCard";

interface ConfirmationProps {
  stageId: string;
  onRestart: () => void;
  classYear?: string;
  bottleneckDetail?: string;
}

const confettiEmojis = ["🎉", "✨", "🙌"];

const Confirmation = ({ stageId, onRestart, classYear, bottleneckDetail }: ConfirmationProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId);
  const { resources } = useResources();

  const profile = {
    class_year: classYear || null,
    pipeline_stage: stageId || null,
    bottleneck_detail: bottleneckDetail || null,
  };

  const matched = useMemo(
    () => getMatchedResources(resources, profile, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resources, classYear, stageId, bottleneckDetail]
  );

  const highlightTags = [bottleneckDetail, stageId].filter(Boolean) as string[];

  const allParams = new URLSearchParams();
  if (classYear) allParams.set("year", classYear);
  if (stageId) allParams.set("stage", stageId);
  if (bottleneckDetail) allParams.set("detail", bottleneckDetail);
  const seeAllHref = `/resources?${allParams.toString()}`;

  return (
    <div className="animate-fade-in pt-2">
      {/* Compact celebration */}
      <div className="mb-5 text-center">
        <div className="mb-3 flex justify-center gap-2">
          {confettiEmojis.map((emoji, i) => (
            <span
              key={i}
              className="animate-emoji-pop text-2xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <h2 className="text-[22px] font-bold leading-tight text-foreground">
          Thanks — that's incredibly helpful.
        </h2>
        {stage && (
          <p className="mx-auto mt-2 max-w-[340px] text-[14px] leading-snug text-muted-foreground">
            {adaptText(stage.resourceNudge, classYear)}
          </p>
        )}
      </div>

      {/* Hero: matched resources */}
      {matched.length > 0 ? (
        <div className="rounded-2xl border-2 border-[hsl(170_70%_40%)]/40 bg-[hsl(170_60%_97%)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[hsl(170_70%_30%)]" />
            <h3 className="text-[15px] font-semibold text-[hsl(170_70%_22%)]">
              Matched for you based on your answers
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {matched.map(({ resource }) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                matched
                compact
                highlightTags={highlightTags}
              />
            ))}
          </div>

          <Link
            to={seeAllHref}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[hsl(170_70%_40%)] bg-card px-4 py-3 text-sm font-medium text-[hsl(170_70%_25%)] transition-colors hover:bg-[hsl(170_60%_94%)]"
          >
            See all resources <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            We don't have a perfect-fit resource pre-loaded yet, but the career center can help.
          </p>
          <Link
            to={seeAllHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse all resources <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Demoted restart link */}
      <div className="mt-6 text-center">
        <button
          onClick={onRestart}
          style={{ touchAction: "manipulation" }}
          className="text-xs text-muted-foreground/80 underline underline-offset-4 hover:text-foreground"
        >
          Take the survey again
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
