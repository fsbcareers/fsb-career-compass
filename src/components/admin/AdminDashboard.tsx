import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchSheetData, type FetchResult } from "@/utils/fetchSheetData";
import type { SurveyResponse } from "@/utils/generateMockData";
import AdminNav from "./AdminNav";
import MetricCards from "./MetricCards";
import BottleneckHeatmap from "./BottleneckHeatmap";
import DrilldownPanel from "./DrilldownPanel";
import ResponseTimeline from "./ResponseTimeline";
import CompactResponses from "./CompactResponses";
import DateRangeFilter from "./DateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface AdminDashboardProps {
  onSignOut: () => void;
}

export type DateFilter = "all" | "semester" | "30days" | "custom";

const AdminDashboard = ({ onSignOut }: AdminDashboardProps) => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customRange, setCustomRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedCell, setSelectedCell] = useState<{ year: string; stage: string } | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setFetchError(false);

    try {
      const result: FetchResult = await fetchSheetData();
      setData(result.data);
      setFetchedAt(result.fetchedAt);
      setIsMock(result.isMock);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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

  if (fetchError && data.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-foreground font-medium">Unable to load data</p>
          <p className="text-sm text-muted-foreground">Check your connection and refresh.</p>
          <button
            onClick={() => loadData()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = data.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1100px] mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Farmer School of Business
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            {fetchedAt && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {isMock ? "Mock data" : `Data as of ${format(fetchedAt, "h:mma")}`}
                </span>
                <button
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
            )}
            <button
              onClick={onSignOut}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <AdminNav />

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

          {isEmpty ? (
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-foreground font-medium">No responses yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Share the survey link to start collecting data.{" "}
                <Link to="/distribute" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Distribution tools →
                </Link>
              </p>
            </div>
          ) : (
            <>
              <DrilldownPanel data={filteredData} selectedCell={selectedCell} />
              <ResponseTimeline data={filteredData} />
              <CompactResponses data={filteredData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
