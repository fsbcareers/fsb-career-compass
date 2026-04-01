import { useMemo, useState } from "react";
import { getLabel } from "@/utils/labelMap";
import type { SurveyResponse } from "@/utils/generateMockData";
import { format } from "date-fns";

interface ResponseFeedProps {
  data: SurveyResponse[];
}

type SortKey = "timestamp" | "class_year" | "pipeline_stage" | "bottleneck_detail" | "question_count";

const yearColors: Record<string, string> = {
  freshman: "bg-blue-100 text-blue-800",
  sophomore: "bg-teal-100 text-teal-800",
  junior: "bg-purple-100 text-purple-800",
  senior: "bg-amber-100 text-amber-800",
};

const ResponseFeed = ({ data }: ResponseFeedProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const sliced = [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return sliced.slice(0, 50);
  }, [data, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const thClass = "p-2 text-xs text-muted-foreground font-normal cursor-pointer hover:text-foreground select-none text-left";

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <h3 className="text-sm font-medium text-foreground p-4 pb-2">Recent Responses</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className={thClass} onClick={() => toggleSort("timestamp")}>Time {sortKey === "timestamp" ? (sortAsc ? "↑" : "↓") : ""}</th>
              <th className={thClass} onClick={() => toggleSort("class_year")}>Year</th>
              <th className={thClass} onClick={() => toggleSort("pipeline_stage")}>Stage</th>
              <th className={thClass} onClick={() => toggleSort("bottleneck_detail")}>Detail</th>
              <th className={thClass} onClick={() => toggleSort("question_count")}>Qs</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.row_id} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
                <td className="p-2 text-xs text-muted-foreground whitespace-nowrap">
                  {r.timestamp ? format(new Date(r.timestamp), "MMM d, h:mma") : "—"}
                </td>
                <td className="p-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${yearColors[r.class_year] || ""}`}>
                    {getLabel(r.class_year)}
                  </span>
                </td>
                <td className="p-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {getLabel(r.pipeline_stage).slice(0, 30)}…
                  </span>
                </td>
                <td className="p-2 text-xs text-foreground truncate max-w-[150px]">{getLabel(r.bottleneck_detail)}</td>
                <td className="p-2 text-xs text-center text-muted-foreground">{r.question_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseFeed;
