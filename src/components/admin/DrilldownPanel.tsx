import { useMemo } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import type { SurveyResponse } from "@/utils/generateMockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DrilldownPanelProps {
  data: SurveyResponse[];
  selectedCell: { year: string; stage: string } | null;
}

const yearLabels: Record<string, string> = { freshman: "Freshman", sophomore: "Sophomore", junior: "Junior", senior: "Senior" };

function lookupLabel(stageId: string, detailId: string): string {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId);
  if (!stage) return detailId;
  const opt = stage.drilldownOptions.find((o) => o.id === detailId);
  return opt?.label || detailId;
}

function lookupStageLabel(stageId: string): string {
  return surveyConfig.pipelineStages.find((s) => s.id === stageId)?.label?.split("—")[0]?.trim() || stageId;
}

function lookupFollowUpLabel(qIdx: number, optId: string): string {
  const q = surveyConfig.followUpQuestions[qIdx];
  return q?.options.find((o) => o.id === optId)?.label || optId;
}

const DrilldownPanel = ({ data, selectedCell }: DrilldownPanelProps) => {
  const { filtered, detailCounts, header, followUpData } = useMemo(() => {
    let subset = data;
    let hdr = "Overall bottleneck breakdown";

    if (selectedCell) {
      subset = data.filter(
        (r) => r.class_year === selectedCell.year && r.pipeline_stage === selectedCell.stage
      );
      hdr = `${yearLabels[selectedCell.year]} × ${lookupStageLabel(selectedCell.stage)} (n=${subset.length})`;
    }

    const counts: Record<string, number> = {};
    subset.forEach((r) => {
      if (r.bottleneck_detail) {
        counts[r.bottleneck_detail] = (counts[r.bottleneck_detail] || 0) + 1;
      }
    });

    const fuData: { question: string; distribution: { label: string; count: number }[] }[] = [];
    for (let i = 0; i < 5; i++) {
      const key = `follow_up_${i + 1}` as keyof SurveyResponse;
      const fuCounts: Record<string, number> = {};
      subset.forEach((r) => {
        const val = r[key] as string;
        if (val) fuCounts[val] = (fuCounts[val] || 0) + 1;
      });
      if (Object.keys(fuCounts).length > 0) {
        fuData.push({
          question: surveyConfig.followUpQuestions[i]?.question || `Follow-up ${i + 1}`,
          distribution: Object.entries(fuCounts)
            .map(([id, count]) => ({ label: lookupFollowUpLabel(i, id), count }))
            .sort((a, b) => b.count - a.count),
        });
      }
    }

    return { filtered: subset, detailCounts: counts, header: hdr, followUpData: fuData };
  }, [data, selectedCell]);

  const sorted = Object.entries(detailCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const total = filtered.length || 1;

  // Find the relevant stage for label lookups
  const stageId = selectedCell?.stage || (sorted[0] ? data.find(r => r.bottleneck_detail === sorted[0][0])?.pipeline_stage : undefined);

  return (
    <div className="rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">{header}</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data for this selection.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(([id, count]) => {
            const pct = Math.round((count / total) * 100);
            const label = stageId ? lookupLabel(stageId, id) : id;
            return (
              <div key={id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground truncate mr-2">{label}</span>
                  <span className="text-muted-foreground shrink-0">{pct}% ({count})</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {followUpData.length > 0 && (
        <Collapsible className="mt-6">
          <CollapsibleTrigger className="text-sm text-primary hover:underline">
            ▸ Follow-up insights
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4">
            {followUpData.map((fu, idx) => (
              <div key={idx}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{fu.question}</p>
                <div className="space-y-1">
                  {fu.distribution.map((d) => (
                    <div key={d.label} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 bg-primary/60 rounded" style={{ width: `${(d.count / (fu.distribution[0]?.count || 1)) * 60}px` }} />
                      <span className="text-foreground truncate">{d.label}</span>
                      <span className="text-muted-foreground ml-auto shrink-0">({d.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default DrilldownPanel;
