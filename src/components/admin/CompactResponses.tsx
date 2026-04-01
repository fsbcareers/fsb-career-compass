import { useState, useMemo } from "react";
import { getLabel } from "@/utils/labelMap";
import type { SurveyResponse } from "@/utils/generateMockData";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompactResponsesProps {
  data: SurveyResponse[];
}

const yearColors: Record<string, string> = {
  freshman: "bg-blue-100 text-blue-800",
  sophomore: "bg-teal-100 text-teal-800",
  junior: "bg-purple-100 text-purple-800",
  senior: "bg-amber-100 text-amber-800",
};

type SortKey = "timestamp" | "class_year" | "pipeline_stage" | "bottleneck_detail" | "question_count";

const CompactResponses = ({ data }: CompactResponsesProps) => {
  const [expanded, setExpanded] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortAsc]);

  const recent3 = sorted.slice(0, 3);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const handleExport = () => {
    const headers = ["timestamp", "class_year", "pipeline_stage", "bottleneck_detail", "follow_up_1", "follow_up_2", "follow_up_3", "follow_up_4", "follow_up_5", "question_count", "row_id"];
    const csv = [
      headers.join(","),
      ...data.map((r) =>
        headers.map((h) => {
          const v = r[h as keyof SurveyResponse];
          return typeof v === "string" && v.includes(",") ? `"${v}"` : v ?? "";
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fsb_diagnostic_responses_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const thClass = "p-2 text-xs text-muted-foreground font-normal cursor-pointer hover:text-foreground select-none text-left";

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <h3 className="text-sm font-medium text-foreground p-4 pb-2">Recent Responses</h3>

      {/* Compact 3-card view */}
      {!expanded && (
        <div className="p-4 pt-2 space-y-2">
          {recent3.map((r) => (
            <div key={r.row_id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${yearColors[r.class_year] || ""}`}>
                    {getLabel(r.class_year)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {getLabel(r.pipeline_stage).slice(0, 25)}…
                  </span>
                </div>
                <p className="text-xs text-foreground truncate">{getLabel(r.bottleneck_detail)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">
                  {r.timestamp ? format(new Date(r.timestamp), "MMM d, h:mma") : "—"}
                </p>
                <p className="text-xs text-muted-foreground">{r.question_count} Qs</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded full table */}
      {expanded && (
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
              {sorted.slice(0, 50).map((r, i) => (
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
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 p-4 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="flex-1"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5 mr-1" /> Collapse</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5 mr-1" /> View all responses</>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex-1"
        >
          <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
        </Button>
      </div>
    </div>
  );
};

export default CompactResponses;
