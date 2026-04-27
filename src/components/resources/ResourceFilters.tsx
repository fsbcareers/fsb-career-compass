import { Search } from "lucide-react";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  type ResourceCategory,
  type ResourceType,
} from "@/config/resources";

export interface FilterState {
  category: ResourceCategory | "all";
  type: ResourceType | "all";
  year: string; // "all" | "freshman" | ...
  search: string;
}

const YEAR_OPTIONS = [
  { value: "all", label: "All years" },
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
];

interface ResourceFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{ touchAction: "manipulation" }}
    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground hover:bg-secondary"
    }`}
  >
    {children}
  </button>
);

const ResourceFilters = ({ filters, onChange }: ResourceFiltersProps) => {
  return (
    <div className="space-y-3">
      {/* Sticky search */}
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:mx-0 sm:rounded-lg sm:px-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            inputMode="search"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Pill
            active={filters.category === "all"}
            onClick={() => onChange({ ...filters, category: "all" })}
          >
            All
          </Pill>
          {RESOURCE_CATEGORIES.map((c) => (
            <Pill
              key={c}
              active={filters.category === c}
              onClick={() => onChange({ ...filters, category: c })}
            >
              {c}
            </Pill>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Type</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Pill
            active={filters.type === "all"}
            onClick={() => onChange({ ...filters, type: "all" })}
          >
            All types
          </Pill>
          {RESOURCE_TYPES.map((t) => (
            <Pill
              key={t.value}
              active={filters.type === t.value}
              onClick={() => onChange({ ...filters, type: t.value })}
            >
              {t.label}
            </Pill>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Class year</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {YEAR_OPTIONS.map((y) => (
            <Pill
              key={y.value}
              active={filters.year === y.value}
              onClick={() => onChange({ ...filters, year: y.value })}
            >
              {y.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;