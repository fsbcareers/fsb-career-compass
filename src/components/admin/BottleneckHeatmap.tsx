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

const stages = surveyConfig.pipelineStages.filter((s) => s.id !== "already_secured");
const buckets = surveyConfig.buckets.filter((b) => b.id !== "already_done");

const shortLabels: Record<string, string> = {
  awareness: "Aware",
  direction: "Direct",
  search: "Search",
  materials: "Mats",
  applying: "Apply",
  screening: "Screen",
  live_interviews: "Live Int",
  offers: "Offers",
  waiting: "Wait",
};

function getCellColor(pct: number): { bg: string; text: string } {
  if (pct === 0) return { bg: "transparent", text: "hsl(var(--muted-foreground))" };
  if (pct <= 10) return { bg: "hsl(155 60% 92%)", text: "hsl(var(--foreground))" }; // light green
  if (pct <= 20) return { bg: "hsl(48 96% 89%)", text: "hsl(var(--foreground))" }; // light amber
  if (pct <= 30) return { bg: "hsl(32 98% 83%)", text: "hsl(var(--foreground))" }; // light orange
  if (pct <= 40) return { bg: "hsl(27 96% 72%)", text: "hsl(var(--foreground))" }; // medium coral
  return { bg: "hsl(0 84% 70%)", text: "hsl(0 0% 100%)" }; // strong red
}

function getSecuredColor(pct: number): { bg: string; text: string } {
  if (pct === 0) return { bg: "transparent", text: "hsl(var(--muted-foreground))" };
  if (pct <= 20) return { bg: "hsl(155 60% 92%)", text: "hsl(var(--foreground))" };
  if (pct <= 40) return { bg: "hsl(160 55% 75%)", text: "hsl(var(--foreground))" };
  return { bg: "hsl(160 65% 35%)", text: "hsl(0 0% 100%)" };
}

const BottleneckHeatmap = ({ data, selectedCell, onCellSelect }: BottleneckHeatmapProps) => {
  const { grid, yearTotals, colTotals, totalResponses, securedCount } = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};
    const yTotals: Record<string, number> = {};
    let secured = 0;
    years.forEach((y) => {
      counts[y] = {};
      stages.forEach((s) => (counts[y][s.id] = 0));
      yTotals[y] = 0;
    });

    data.forEach((r) => {
      if (r.pipeline_stage === "already_secured") {
        secured++;
        return;
      }
      if (counts[r.class_year] && counts[r.class_year][r.pipeline_stage] !== undefined) {
        counts[r.class_year][r.pipeline_stage]++;
        yTotals[r.class_year]++;
      }
    });

    const cTotals: Record<string, number> = {};
    stages.forEach((s) => {
      cTotals[s.id] = years.reduce((sum, y) => sum + counts[y][s.id], 0);
    });

    const nonSecuredTotal = data.length - secured;
    return { grid: counts, yearTotals: yTotals, colTotals: cTotals, totalResponses: nonSecuredTotal, securedCount: secured };
  }, [data]);

  const isSecuredSelected = selectedCell?.year === "senior" && selectedCell?.stage === "already_secured";

  return (
    <div className="overflow-x-auto">
      {securedCount > 0 && (
        <button
          onClick={() => onCellSelect(isSecuredSelected ? null : { year: "senior", stage: "already_secured" })}
          className={`mb-3 w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
            isSecuredSelected
              ? "bg-[hsl(160_40%_92%)] ring-2 ring-[hsl(160_60%_40%)] text-[hsl(160_60%_30%)]"
              : "bg-[hsl(160_30%_95%)] hover:bg-[hsl(160_40%_92%)] text-[hsl(160_50%_30%)]"
          }`}
        >
          <span className="text-[hsl(160_60%_40%)]">✓</span>
          <span className="font-medium">{securedCount} senior{securedCount !== 1 ? "s" : ""} already secured a job</span>
          <span className="ml-auto text-xs text-muted-foreground">View breakdown →</span>
        </button>
      )}
      <table className="w-full text-sm" style={{ borderSpacing: "3px 6px", borderCollapse: "separate" }}>
        <thead>
          {/* Bucket group headers */}
          <tr>
            <th />
            {buckets.map((b) => (
              <th
                key={b.id}
                colSpan={b.stages.length}
                className="px-1 pt-2 pb-1 text-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-normal border-b border-border"
              >
                {b.label}
              </th>
            ))}
            <th />
          </tr>
          {/* Individual stage columns */}
          <tr>
            <th className="px-2 py-2 text-left text-xs text-muted-foreground font-normal" />
            {stages.map((s) => (
              <th key={s.id} className="px-2 py-2 text-center text-xs text-muted-foreground font-normal min-w-[60px]">
                {shortLabels[s.id] || s.shortLabel}
              </th>
            ))}
            <th className="px-2 py-2 text-center text-xs text-muted-foreground font-normal">n</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y) => (
            <tr key={y}>
              <td className="px-2 py-2.5 text-sm font-medium text-foreground whitespace-nowrap">{yearLabels[y]}</td>
              {stages.map((s) => {
                const count = grid[y][s.id];
                const pct = yearTotals[y] ? Math.round((count / yearTotals[y]) * 100) : 0;
                const { bg, text } = getCellColor(pct);
                const isSelected = selectedCell?.year === y && selectedCell?.stage === s.id;
                return (
                  <td
                    key={s.id}
                    onClick={() => onCellSelect(isSelected ? null : { year: y, stage: s.id })}
                    className={`px-2 py-2.5 text-center cursor-pointer rounded-md transition-all ${
                      isSelected ? "ring-2 ring-ring ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {pct > 0 ? `${pct}%` : "—"}
                  </td>
                );
              })}
              <td className="px-2 py-2.5 text-center text-xs text-muted-foreground">n={yearTotals[y]}</td>
            </tr>
          ))}
          <tr>
            <td className="px-2 pt-4 pb-2 text-xs text-muted-foreground border-t border-border">Overall</td>
            {stages.map((s) => {
              const pct = totalResponses ? Math.round((colTotals[s.id] / totalResponses) * 100) : 0;
              return (
                <td key={s.id} className="px-2 pt-4 pb-2 text-center text-xs text-muted-foreground border-t border-border">
                  {pct}%
                </td>
              );
            })}
            <td className="px-2 pt-4 pb-2 text-center text-xs text-muted-foreground border-t border-border">n={totalResponses}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BottleneckHeatmap;
