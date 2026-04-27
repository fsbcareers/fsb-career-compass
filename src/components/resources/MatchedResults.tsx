import type { Resource } from "@/config/resources";
import { getMatchedResources, type StudentProfile } from "@/utils/resourceMatcher";
import ResourceCard from "./ResourceCard";

interface MatchedResultsProps {
  resources: Resource[];
  profile: StudentProfile;
  limit?: number;
  emptyMessage?: string;
}

const MatchedResults = ({ resources, profile, limit = 5, emptyMessage }: MatchedResultsProps) => {
  const matched = getMatchedResources(resources, profile, limit);
  const highlightTags = [profile.bottleneck_detail, profile.pipeline_stage].filter(
    Boolean
  ) as string[];

  if (matched.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ||
            "No exact matches yet. Browse all resources below — the General Career Advising Appointment is a great place to start."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {matched.map(({ resource }) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          matched
          highlightTags={highlightTags}
        />
      ))}
    </div>
  );
};

export default MatchedResults;