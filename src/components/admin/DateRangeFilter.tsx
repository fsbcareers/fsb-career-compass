import type { DateFilter } from "./AdminDashboard";

interface DateRangeFilterProps {
  filter: DateFilter;
  onFilterChange: (f: DateFilter) => void;
  customRange: { from: string; to: string };
  onCustomRangeChange: (r: { from: string; to: string }) => void;
}

const buttons: { label: string; value: DateFilter }[] = [
  { label: "All time", value: "all" },
  { label: "This semester", value: "semester" },
  { label: "Last 30 days", value: "30days" },
  { label: "Custom", value: "custom" },
];

const DateRangeFilter = ({ filter, onFilterChange, customRange, onCustomRangeChange }: DateRangeFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {buttons.map((b) => (
        <button
          key={b.value}
          onClick={() => onFilterChange(b.value)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            filter === b.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-input hover:bg-secondary"
          }`}
        >
          {b.label}
        </button>
      ))}
      {filter === "custom" && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={customRange.from}
            onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
            className="h-8 px-2 text-sm rounded border border-input bg-card text-foreground"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <input
            type="date"
            value={customRange.to}
            onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
            className="h-8 px-2 text-sm rounded border border-input bg-card text-foreground"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
