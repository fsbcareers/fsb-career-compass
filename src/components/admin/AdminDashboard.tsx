import { useState, useEffect, useMemo } from "react";
import { fetchSheetData } from "@/utils/fetchSheetData";
import type { SurveyResponse } from "@/utils/generateMockData";
import MetricCards from "./MetricCards";
import BottleneckHeatmap from "./BottleneckHeatmap";
import DrilldownPanel from "./DrilldownPanel";
import ResponseTimeline from "./ResponseTimeline";
import ResponseFeed from "./ResponseFeed";
import ExportButton from "./ExportButton";
import QRCodePanel from "./QRCodePanel";
import EmailSnippets from "./EmailSnippets";
import SurveyEditor from "./SurveyEditor";
import DateRangeFilter from "./DateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminDashboardProps {
  onSignOut: () => void;
}

export type DateFilter = "all" | "semester" | "30days" | "custom";

const AdminDashboard = ({ onSignOut }: AdminDashboardProps) => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customRange, setCustomRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedCell, setSelectedCell] = useState<{ year: string; stage: string } | null>(null);

  useEffect(() => {
    fetchSheetData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();
    return data.filter((row) => {
      if (!row.timestamp) return dateFilter === "all";
      const ts = new Date(row.timestamp);
      switch (dateFilter) {
        case "30days":
          return now.getTime() - ts.getTime() < 30 * 24 * 60 * 60 * 1000;
        case "semester": {
          const semStart = new Date(now.getFullYear(), now.getMonth() >= 7 ? 7 : 0, 1);
          return ts >= semStart;
        }
        case "custom": {
          const from = customRange.from ? new Date(customRange.from) : new Date(0);
          const to = customRange.to ? new Date(customRange.to + "T23:59:59") : new Date();
          return ts >= from && ts <= to;
        }
        default:
          return true;
      }
    });
  }, [data, dateFilter, customRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1100px] mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Farmer School of Business
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">Admin Dashboard</p>
          </div>
          <button
            onClick={onSignOut}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="space-y-8">
          <MetricCards data={filteredData} />

          <div>
            <DateRangeFilter
              filter={dateFilter}
              onFilterChange={setDateFilter}
              customRange={customRange}
              onCustomRangeChange={setCustomRange}
            />
            <BottleneckHeatmap
              data={filteredData}
              selectedCell={selectedCell}
              onCellSelect={setSelectedCell}
            />
          </div>

          <DrilldownPanel data={filteredData} selectedCell={selectedCell} />

          <ResponseTimeline data={filteredData} />

          <ResponseFeed data={filteredData} />

          <div className="border-t border-border pt-8 space-y-8">
            <h2 className="text-lg font-semibold text-foreground">Admin Tools</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ExportButton data={data} />
              <QRCodePanel />
            </div>
            <EmailSnippets />
          </div>

          <div className="border-t border-border pt-8 space-y-8">
            <h2 className="text-lg font-semibold text-foreground">Survey Editor</h2>
            <SurveyEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
