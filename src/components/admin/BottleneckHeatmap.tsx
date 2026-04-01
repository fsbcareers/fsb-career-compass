import { useMemo } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import type { SurveyResponse } from "@/utils/generateMockData";

interface BottleneckHeatmapProps {
  data: SurveyResponse[];
  selectedCell: { year: string; stage: string } | null;
  onCellSelect: (cell: { year: string; stage: string } | null) => void;
}

const years = ["freshman", "sophomore", "junior", "senior"];
const yearLabels: Record<string, string> = { freshman: "Freshman", sophomore: "Sophomore", junior: "Junior", senior: "Senior" };
const shortStageLabels = ["Not started", "Career clarity", "Finding opps", "Materials", "Responses", "Interviews", "Offers"];

function getCellColor(pct: number): { bg: string; text: string } {
  if (pct === 0) return { bg: "transparent", text: "hsl(var(--muted-foreground))" };
  if (pct < 10) return { bg: "hsl(160 40% 94%)", text: "hsl(var(--foreground))" };
  if (pct < 20) return { bg: "hsl(160 50% 75%)", text: "hsl(var(--foreground))" };
  if (pct < 30) return { bg: "hsl(160 60% 55%)", text: "hsl(0 0% 100%)" };
  return { bg: "hsl(160 70% 37%)", text: "hsl(0 0% 100%)" };
}

const BottleneckHeatmap = ({ data, selectedCell, onCellSelect }: BottleneckHeatmapProps) => {
  const stages = surveyConfig.pipelineStages;

  const { grid, yearTotals, colTotals, totalResponses } = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};
    const yTotals: Record<string, number> = {};
    years.forEach((y) => {
      counts[y] = {};
      stages.forEach((s) => (counts[y][s.id] = 0));
      yTotals[y] = 0;
    });

    data.forEach((r) => {
      if (counts[r.class_year] && counts[r.class_year][r.pipeline_stage] !== undefined) {
        counts[r.class_year][r.pipeline_stage]++;
        yTotals[r.class_year]++;
      }
    });

    const cTotals: Record<string, number> = {};
    stages.forEach((s) => {
      cTotals[s.id] = years.reduce((sum, y) => sum + counts[y][s.id], 0);
    });

    return { grid: counts, yearTotals: yTotals, colTotals: cTotals, totalResponses: data.length };
  }, [data, stages]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs text-muted-foreground font-normal" />
            {stages.map((s, i) => (
              <th key={s.id} className="p-2 text-center text-xs text-muted-foreground font-normal min-w-[80px]">
                {shortStageLabels[i]}
              </th>
            ))}
            <th className="p-2 text-center text-xs text-muted-foreground font-normal">n</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y) => (
            <tr key={y}>
              <td className="p-2 text-sm font-medium text-foreground">{yearLabels[y]}</td>
              {stages.map((s) => {
                const count = grid[y][s.id];
                const pct = yearTotals[y] ? Math.round((count / yearTotals[y]) * 100) : 0;
                const { bg, text } = getCellColor(pct);
                const isSelected = selectedCell?.year === y && selectedCell?.stage === s.id;
                return (
                  <td
                    key={s.id}
                    onClick={() =>
                      onCellSelect(isSelected ? null : { year: y, stage: s.id })
                    }
                    className={`p-2 text-center cursor-pointer rounded transition-all ${
                      isSelected ? "ring-2 ring-ring ring-offset-1" : ""
                    }`}
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {pct > 0 ? `${pct}%` : "—"}
                  </td>
                );
              })}
              <td className="p-2 text-center text-xs text-muted-foreground">n={yearTotals[y]}</td>
            </tr>
          ))}
          <tr className="border-t border-border">
            <td className="p-2 text-xs text-muted-foreground">Overall</td>
            {stages.map((s) => {
              const pct = totalResponses ? Math.round((colTotals[s.id] / totalResponses) * 100) : 0;
              return (
                <td key={s.id} className="p-2 text-center text-xs text-muted-foreground">
                  {pct}%
                </td>
              );
            })}
            <td className="p-2 text-center text-xs text-muted-foreground">n={totalResponses}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BottleneckHeatmap;
