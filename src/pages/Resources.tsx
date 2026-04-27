import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useResources } from "@/hooks/useResources";
import GuidedMatch from "@/components/resources/GuidedMatch";
import MatchedResults from "@/components/resources/MatchedResults";
import ResourceBrowser from "@/components/resources/ResourceBrowser";
import { getMatchedResources, hasUsableProfile } from "@/utils/resourceMatcher";

interface Answers {
  year: string;
  stage: string;
  detail: string;
}

const Resources = () => {
  const { resources } = useResources();
  const [params, setParams] = useSearchParams();

  // Read URL params (sent by survey confirmation deep link).
  const urlYear = params.get("year") ?? "";
  const urlStage = params.get("stage") ?? "";
  const urlDetail = params.get("detail") ?? "";

  const [answers, setAnswers] = useState<Answers | null>(() => {
    if (urlYear || urlStage || urlDetail) {
      return { year: urlYear, stage: urlStage, detail: urlDetail };
    }
    return null;
  });
  const [editing, setEditing] = useState(false);

  // Sync URL when answers change so the page is shareable.
  useEffect(() => {
    if (!answers) return;
    const next = new URLSearchParams();
    if (answers.year) next.set("year", answers.year);
    if (answers.stage) next.set("stage", answers.stage);
    if (answers.detail) next.set("detail", answers.detail);
    setParams(next, { replace: true });
  }, [answers, setParams]);

  const profile = useMemo(
    () =>
      answers
        ? {
            class_year: answers.year || null,
            pipeline_stage: answers.stage || null,
            bottleneck_detail: answers.detail || null,
          }
        : null,
    [answers]
  );

  const matchedSet = useMemo(() => {
    if (!profile) return new Set<string>();
    return new Set(getMatchedResources(resources, profile, 5).map((m) => m.resource.id));
  }, [profile, resources]);

  const showGuided = !answers || editing;
  const showMatches = answers && !editing && (hasUsableProfile(profile!) || answers.year);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[960px] px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Farmer School of Business
            </p>
            <p className="text-sm text-muted-foreground">Career Resources</p>
          </div>
          <Link
            to="/survey"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Survey
          </Link>
        </div>

        <h1 className="mb-2 text-[26px] font-bold leading-tight text-foreground sm:text-[30px]">
          Career resources, matched to where you are
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          Workshops, advising, and tools the FSB Career Center offers — filtered to what's most useful for your situation.
        </p>

        {/* Guided section */}
        {showGuided ? (
          <div className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <GuidedMatch
              initial={answers ?? undefined}
              onComplete={(a) => {
                setAnswers(a);
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <div className="mb-6">
            <GuidedMatch
              collapsed
              current={answers!}
              onComplete={() => {}}
              onChange={() => setEditing(true)}
            />
          </div>
        )}

        {/* Matched results */}
        {showMatches && (
          <section className="mb-10 border-t-2 border-[hsl(170_70%_40%)] pt-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[hsl(170_70%_40%)]" />
              <h2 className="text-lg font-semibold text-foreground">Matched for you</h2>
            </div>
            <MatchedResults resources={resources} profile={profile!} limit={5} />
          </section>
        )}

        {/* Browse all */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Browse all resources</h2>
          </div>
          <ResourceBrowser resources={resources} matchedIds={matchedSet} />
        </section>
      </div>
    </div>
  );
};

export default Resources;