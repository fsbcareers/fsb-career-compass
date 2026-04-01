import type { SurveyResponse } from "@/utils/generateMockData";
import { format } from "date-fns";

interface ExportButtonProps {
  data: SurveyResponse[];
}

const ExportButton = ({ data }: ExportButtonProps) => {
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

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-2">Export Data</h3>
      <button
        onClick={handleExport}
        className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Export CSV ({data.length} rows)
      </button>
    </div>
  );
};

export default ExportButton;
