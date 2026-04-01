import { surveyConfig } from "../config/surveyConfig";

export const labelMap: Record<string, string> = {};

// Pipeline stage IDs → labels
surveyConfig.pipelineStages.forEach((stage) => {
  labelMap[stage.id] = stage.label;
  // Drill-down option IDs → labels
  stage.drilldownOptions.forEach((opt) => {
    labelMap[opt.id] = opt.label;
  });
});

// Follow-up option IDs → labels
surveyConfig.followUpQuestions.forEach((q) => {
  q.options.forEach((opt) => {
    labelMap[opt.id] = opt.label;
  });
});

// Class year IDs → labels
labelMap["freshman"] = "Freshman";
labelMap["sophomore"] = "Sophomore";
labelMap["junior"] = "Junior";
labelMap["senior"] = "Senior";

export function getLabel(id: string): string {
  return labelMap[id] || id;
}
