

## Plan: Add "Already Secured" Senior Path

### What This Does
For seniors only, adds a new option at the top of the stage selection: **"I already have a job/offer secured"**. When selected, instead of the normal bottleneck flow, it asks retrospective questions like "Looking back, what was the hardest part of your job search?" — collecting data from successful students that helps inform support for those still searching.

### How It Works

**1. Add new pipeline stage to `surveyConfig.ts`**
- Add a new stage `already_secured` with drilldown question: "Looking back at your job search, what was the most challenging part of the process?"
- Drilldown options cover the same pipeline areas retrospectively:
  - "Figuring out what kind of job I actually wanted"
  - "Finding the right opportunities to apply to"
  - "Getting my resume and materials strong enough"
  - "Hearing back after submitting applications"
  - "Performing well in interviews"
  - "Evaluating and deciding between offers"
- Resource nudge congratulates them and explains how their input helps other students

**2. Add a new bucket to `surveyConfig.ts`**
- New bucket `already_done` (e.g. "Already secured") with icon `CheckCircle`, containing only the `already_secured` stage
- Positioned at the top of the buckets array so it appears first

**3. Conditionally show this bucket only for seniors in `StageSelect.tsx`**
- Filter `surveyConfig.buckets` to exclude `already_done` for non-senior class years
- For seniors, it renders at the top with distinct styling (e.g. a celebratory feel)

**4. Update `SurveyContainer.tsx` flow**
- No structural changes needed — the `already_secured` stage flows through the same `handleStage` → `handleDrilldown` → follow-up pipeline
- The follow-up questions still apply (applications count, timing, lead sources, etc.) but the `seniorText` adapter already swaps "internship" → "job"

**5. Update `labelMap.ts`**
- Automatically picks up new stage/option IDs from config (no manual change needed since it iterates `surveyConfig`)

**6. Update `generateMockData.ts`**
- Add `already_secured` to the stage pool with a weight for seniors only, so mock data includes this path

### Files Changed
- `src/config/surveyConfig.ts` — new bucket + new pipeline stage
- `src/components/survey/StageSelect.tsx` — filter buckets by class year
- `src/utils/generateMockData.ts` — include new stage in mock data for seniors

