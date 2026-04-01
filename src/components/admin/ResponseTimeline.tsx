import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SurveyResponse } from "@/utils/generateMockData";
import { format } from "date-fns";

interface ResponseTimelineProps {
  data: SurveyResponse[];
}

const ResponseTimeline = ({ data }: ResponseTimelineProps) => {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      if (!r.timestamp) return;
      const day = format(new Date(r.timestamp), "yyyy-MM-dd");
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({
        date: format(new Date(date), "MMM d"),
        count,
      }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Response Timeline</h3>
        <p className="text-sm text-muted-foreground">No timestamp data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">Response Timeline</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              name="Responses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResponseTimeline;
