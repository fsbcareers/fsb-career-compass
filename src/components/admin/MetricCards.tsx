import { useMemo } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import type { SurveyResponse } from "@/utils/generateMockData";

interface MetricCardsProps {
  data: SurveyResponse[];
}

const MetricCards = ({ data }: MetricCardsProps) => {
  const metrics = useMemo(() => {
    const total = data.length;
    const avgQ = total ? (data.reduce((s, r) => s + (r.question_count || 0), 0) / total).toFixed(1) : "0";

    const stageCounts: Record<string, number> = {};
    const yearCounts: Record<string, number> = {};
    data.forEach((r) => {
      stageCounts[r.pipeline_stage] = (stageCounts[r.pipeline_stage] || 0) + 1;
      yearCounts[r.class_year] = (yearCounts[r.class_year] || 0) + 1;
    });

    const topStage = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0];
    const topYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0];
    const stageLabel = topStage
      ? surveyConfig.pipelineStages.find((s) => s.id === topStage[0])?.label?.split(" ").slice(0, 5).join(" ") + "…"
      : "N/A";

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = data.filter((r) => r.timestamp && new Date(r.timestamp).getTime() > weekAgo).length;

    return [
      { label: "Total responses", value: total.toString() },
      { label: "Avg questions answered", value: avgQ },
      { label: "Top bottleneck", value: stageLabel || "N/A" },
      { label: "Most stuck year", value: topYear ? topYear[0].charAt(0).toUpperCase() + topYear[0].slice(1) : "N/A" },
      { label: "This week", value: thisWeek > 0 ? thisWeek.toString() : "N/A" },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-lg bg-secondary p-4">
          <p className="text-xs text-muted-foreground">{m.label}</p>
          <p className="text-2xl font-bold text-foreground mt-1 truncate" title={m.value}>{m.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
