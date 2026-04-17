import { useMemo, useState } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { getLabel } from "@/utils/labelMap";
import type { SurveyResponse } from "@/utils/generateMockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DrilldownPanelProps {
  data: SurveyResponse[];
  selectedCell: { year: string; stage: string } | null;
}

const INITIAL_SHOW = 10;

const DrilldownPanel = ({ data, selectedCell }: DrilldownPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  const { filtered, detailCounts, header, followUpData } = useMemo(() => {
    let subset = data;
    let hdr = "Overall bottleneck breakdown";

    if (selectedCell) {
      subset = data.filter(
        (r) => r.class_year === selectedCell.year && r.pipeline_stage === selectedCell.stage
      );
      hdr = `${getLabel(selectedCell.year)} × ${getLabel(selectedCell.stage).split(" ").slice(0, 5).join(" ")}… (n=${subset.length})`;
    }

    const counts: Record<string, number> = {};
    subset.forEach((r) => {
      if (r.bottleneck_detail) {
        counts[r.bottleneck_detail] = (counts[r.bottleneck_detail] || 0) + 1;
      }
    });

    const fuData: { question: string; distribution: { label: string; count: number }[]; multiSelect?: boolean }[] = [];
    surveyConfig.followUpQuestions.forEach((fuQ, qIdx) => {
      // Map question id to the SurveyResponse field
      const key = fuQ.id as keyof SurveyResponse;
      const fuCounts: Record<string, number> = {};
      subset.forEach((r) => {
        const val = r[key] as string;
        if (!val) return;
        // Multi-select values are comma-separated
        const parts = (fuQ as any).multiSelect ? val.split(",").map((p) => p.trim()).filter(Boolean) : [val];
        parts.forEach((p) => {
          fuCounts[p] = (fuCounts[p] || 0) + 1;
        });
      });
      if (Object.keys(fuCounts).length > 0) {
        fuData.push({
          question: fuQ.question,
          multiSelect: !!(fuQ as any).multiSelect,
          distribution: Object.entries(fuCounts)
            .map(([id, count]) => ({ label: getLabel(id), count }))
            .sort((a, b) => b.count - a.count),
        });
      }
    });

    return { filtered: subset, detailCounts: counts, header: hdr, followUpData: fuData };
  }, [data, selectedCell]);

  const sorted = Object.entries(detailCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const total = filtered.length || 1;

  const hasMore = sorted.length > INITIAL_SHOW;
  const visible = expanded ? sorted : sorted.slice(0, INITIAL_SHOW);
  const remaining = sorted.length - INITIAL_SHOW;

  // Reset expanded when selection changes
  useMemo(() => setExpanded(false), [selectedCell]);

  return (
    <div className="rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">{header}</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data for this selection.</p>
      ) : (
        <div className="space-y-2">
          {visible.map(([id, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground truncate mr-2">{getLabel(id)}</span>
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
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary hover:underline mt-2"
            >
              {expanded ? "Show less" : `Show all (${remaining} remaining)`}
            </button>
          )}
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
                {fu.multiSelect && (
                  <p className="text-[11px] text-muted-foreground italic mb-2">
                    Students could select multiple options
                  </p>
                )}
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
