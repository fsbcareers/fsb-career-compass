import { useMemo, useState } from "react";
import type { Resource } from "@/config/resources";
import ResourceCard from "./ResourceCard";
import ResourceFilters, { type FilterState } from "./ResourceFilters";

interface ResourceBrowserProps {
  resources: Resource[];
  matchedIds?: Set<string>;
}

const ResourceBrowser = ({ resources, matchedIds }: ResourceBrowserProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    type: "all",
    year: "all",
    search: "",
  });

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return resources
      .filter((r) => r.active)
      .filter((r) => filters.category === "all" || r.category === filters.category)
      .filter((r) => filters.type === "all" || r.type === filters.type)
      .filter(
        (r) =>
          filters.year === "all" ||
          r.year_tags.includes("all") ||
          r.year_tags.includes(filters.year)
      )
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
  }, [resources, filters]);

  return (
    <section>
      <ResourceFilters filters={filters} onChange={setFilters} />

      <div className="mt-4">
        <p className="mb-3 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No resources match those filters. Try clearing one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                matched={matchedIds?.has(r.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourceBrowser;