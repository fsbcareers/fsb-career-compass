import { surveyConfig } from "@/config/surveyConfig";

export interface SurveyResponse {
  timestamp: string;
  class_year: string;
  pipeline_stage: string;
  bottleneck_detail: string;
  follow_up_1: string;
  follow_up_2: string;
  follow_up_3: string;
  follow_up_4: string;
  follow_up_5: string;
  question_count: number;
  row_id: string;
}

function pick<T>(arr: T[], weights?: number[]): T {
  if (!weights) return arr[Math.floor(Math.random() * arr.length)];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

export function generateMockData(count = 200): SurveyResponse[] {
  const years = ["freshman", "sophomore", "junior", "senior"];
  const yearWeights = [15, 35, 30, 20];
  const stages = surveyConfig.pipelineStages;
  const stageWeights = [25, 12, 15, 12, 22, 10, 4];
  const followUps = surveyConfig.followUpQuestions;

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  return Array.from({ length: count }, (_, i) => {
    const year = pick(years, yearWeights);
    const stageIdx = stages.indexOf(pick(stages, stageWeights));
    const stage = stages[stageIdx];
    const detail = pick(stage.drilldownOptions);

    // question_count: 3 core + 0-5 follow-ups, weighted toward 4-5
    const extraQs = pick([0, 1, 2, 3, 4, 5], [10, 8, 12, 20, 25, 25]);
    const questionCount = 3 + extraQs;

    const fu: string[] = [];
    for (let q = 0; q < 5; q++) {
      if (q < extraQs) {
        fu.push(pick(followUps[q].options).id);
      } else {
        fu.push("");
      }
    }

    const ts = new Date(now - Math.random() * thirtyDaysMs * 2);

    return {
      timestamp: ts.toISOString(),
      class_year: year,
      pipeline_stage: stage.id,
      bottleneck_detail: detail.id,
      follow_up_1: fu[0],
      follow_up_2: fu[1],
      follow_up_3: fu[2],
      follow_up_4: fu[3],
      follow_up_5: fu[4],
      question_count: questionCount,
      row_id: `mock_${i + 1}`,
    };
  });
}
