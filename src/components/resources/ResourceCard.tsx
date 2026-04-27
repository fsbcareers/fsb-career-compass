import { ExternalLink, Sparkles } from "lucide-react";
import {
  RESOURCE_TYPE_LABEL,
  RESOURCE_TYPE_BADGE,
  type Resource,
} from "@/config/resources";
import { getLabel } from "@/utils/labelMap";

interface ResourceCardProps {
  resource: Resource;
  matched?: boolean;
  compact?: boolean;
  /** Optional: highlight which tags caused the match. */
  highlightTags?: string[];
}

const ResourceCard = ({ resource, matched, compact, highlightTags = [] }: ResourceCardProps) => {
  const visibleTags = resource.bottleneck_tags.slice(0, compact ? 2 : 4);

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-card p-4 transition-shadow hover:shadow-md ${
        matched ? "border-[hsl(170_70%_40%)] ring-1 ring-[hsl(170_70%_40%)]/30" : "border-border"
      }`}
    >
      {matched && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-[hsl(170_70%_40%)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
          <Sparkles className="h-2.5 w-2.5" /> Matched for you
        </div>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${RESOURCE_TYPE_BADGE[resource.type]}`}
        >
          {RESOURCE_TYPE_LABEL[resource.type]}
        </span>
        <span className="text-[11px] text-muted-foreground">{resource.category}</span>
      </div>

      <h3 className="text-[16px] font-semibold leading-snug text-foreground">{resource.name}</h3>

      <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
        {resource.description}
      </p>

      {visibleTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Best for:</span>
          {visibleTags.map((tag) => {
            const isMatch = highlightTags.includes(tag);
            return (
              <span
                key={tag}
                className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                  isMatch
                    ? "bg-[hsl(170_70%_40%)]/15 text-[hsl(170_70%_25%)] font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {getLabel(tag)}
              </span>
            );
          })}
          {resource.bottleneck_tags.length > visibleTags.length && (
            <span className="text-[11px] text-muted-foreground/60">
              +{resource.bottleneck_tags.length - visibleTags.length}
            </span>
          )}
        </div>
      )}

      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ touchAction: "manipulation" }}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98] sm:w-auto sm:self-start sm:px-5"
      >
        {resource.link_label || "Learn more"}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

export default ResourceCard;