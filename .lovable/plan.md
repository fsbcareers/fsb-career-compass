

## Plan: Complete the "Already Secured" Senior Path — Remaining Gaps

### What's already done
- `already_secured` stage and `already_done` bucket with `seniorOnly` flag in `surveyConfig.ts`
- Conditional bucket filtering in `StageSelect.tsx`
- Mock data generation for seniors with `already_secured`

### What's left (3 changes)

**1. Secured-only follow-up question (`surveyConfig.ts` + `SurveyContainer.tsx`)**

Add a new follow-up question to the `followUpQuestions` array with an `onlyForStage: "already_secured"` flag:
- "What single resource or experience helped you the most?"
- Options: internship converted, career advisor, personal connection, self-directed
- Insert it as the first item in `followUpQuestions` (index 0), shifting existing ones down

In `SurveyContainer.tsx`, build the follow-up queue dynamically: filter `followUpQuestions` to only include questions where `onlyForStage` matches `stageId` OR `onlyForStage` is undefined. This way secured seniors get this extra question first, then the standard ones; non-secured students skip it entirely.

Save the answer to field `follow_up_secured_1` (the question's `id`).

**2. Green-tinted "Already Secured" card (`StageSelect.tsx`)**

When rendering the `already_done` bucket for seniors, apply distinct styling:
- Light green/teal background (`#E1F5EE`) instead of the default card color
- Teal-colored `CheckCircle` icon instead of muted gray
- Slightly larger icon (24px vs 22px)
- The card already renders at the top since `already_done` is first in the array

**3. Heatmap summary stat above grid (`BottleneckHeatmap.tsx`)**

Option B: Don't include `already_secured` in the heatmap columns. Instead:
- Filter `already_secured` out of the `stages` array used for columns
- Count seniors with `pipeline_stage === "already_secured"` 
- Render a summary bar above the table: "X seniors reported as already secured" with a clickable link to show their retrospective breakdown in the drilldown panel
- Clicking triggers `onCellSelect({ year: "senior", stage: "already_secured" })`

### Files changed
- `src/config/surveyConfig.ts` — add secured-only follow-up question with `onlyForStage` flag
- `src/components/survey/SurveyContainer.tsx` — filter follow-up queue by `stageId`
- `src/components/survey/StageSelect.tsx` — green tint styling for `already_done` bucket
- `src/components/admin/BottleneckHeatmap.tsx` — summary stat above grid, exclude `already_secured` from columns
- `src/utils/generateMockData.ts` — add `follow_up_secured_1` values for secured mock rows

