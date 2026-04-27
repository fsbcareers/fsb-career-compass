import { surveyConfig } from "@/config/surveyConfig";
import type { Resource } from "@/config/resources";

export interface StudentProfile {
  class_year?: string | null;
  pipeline_stage?: string | null;
  bottleneck_detail?: string | null;
}

/** Compute the parent bucket id for a given pipeline stage id. */
export function getBucketForStage(stageId: string | null | undefined): string | null {
  if (!stageId) return null;
  const bucket = surveyConfig.buckets.find((b) => b.stages.includes(stageId));
  return bucket?.id ?? null;
}

/**
 * Score a resource against a student profile.
 *  +15 — drilldown detail match (most specific)
 *  +10 — pipeline stage match
 *  +5  — class year match (or "all")
 *  +3  — parent bucket match
 */
export function scoreResource(resource: Resource, profile: StudentProfile): number {
  if (!resource.active) return 0;
  let score = 0;

  if (profile.bottleneck_detail && resource.bottleneck_tags.includes(profile.bottleneck_detail)) {
    score += 15;
  }
  if (profile.pipeline_stage && resource.bottleneck_tags.includes(profile.pipeline_stage)) {
    score += 10;
  }
  if (
    profile.class_year &&
    (resource.year_tags.includes(profile.class_year) || resource.year_tags.includes("all"))
  ) {
    score += 5;
  }
  const bucketId = getBucketForStage(profile.pipeline_stage);
  if (bucketId && resource.bottleneck_tags.includes(bucketId)) {
    score += 3;
  }

  return score;
}

export interface ScoredResource {
  resource: Resource;
  score: number;
}

/**
 * Return top N matched resources for a profile, sorted by score (desc),
 * then by priority (desc), then by name. Resources scoring 0 are excluded.
 */
export function getMatchedResources(
  resources: Resource[],
  profile: StudentProfile,
  limit = 5
): ScoredResource[] {
  const scored = resources
    .filter((r) => r.active)
    .map((r) => ({ resource: r, score: scoreResource(r, profile) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.resource.priority !== a.resource.priority) return b.resource.priority - a.resource.priority;
      return a.resource.name.localeCompare(b.resource.name);
    });
  return scored.slice(0, limit);
}

export function hasUsableProfile(profile: StudentProfile): boolean {
  return Boolean(profile.pipeline_stage || profile.bottleneck_detail);
}