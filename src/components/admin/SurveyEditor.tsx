import { useState } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";

type StageData = typeof surveyConfig.pipelineStages[number];
type FollowUpData = typeof surveyConfig.followUpQuestions[number] & { disabled?: boolean };

const SurveyEditor = () => {
  const [stages, setStages] = useState<StageData[]>(() => JSON.parse(JSON.stringify(surveyConfig.pipelineStages)));
  const [followUps, setFollowUps] = useState<(FollowUpData)[]>(() => JSON.parse(JSON.stringify(surveyConfig.followUpQuestions)));
  const [prompts, setPrompts] = useState<string[]>(() => [...surveyConfig.continuePrompts]);

  const updateStage = (idx: number, patch: Partial<StageData>) => {
    setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const updateStageOption = (sIdx: number, oIdx: number, label: string) => {
    setStages((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, drilldownOptions: s.drilldownOptions.map((o, j) => (j === oIdx ? { ...o, label } : o)) }
          : s
      )
    );
  };

  const updateFollowUp = (idx: number, patch: Partial<FollowUpData>) => {
    setFollowUps((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const updateFollowUpOption = (qIdx: number, oIdx: number, label: string) => {
    setFollowUps((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, label } : o)) }
          : q
      )
    );
  };

  const moveFollowUp = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= followUps.length) return;
    setFollowUps((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const addFollowUp = () => {
    if (followUps.length >= 8) return;
    setFollowUps((prev) => [
      ...prev,
      {
        id: `follow_up_${prev.length + 1}`,
        question: "New question",
        options: [
          { id: `new_opt_1`, label: "Option 1", icon: "Circle" },
          { id: `new_opt_2`, label: "Option 2", icon: "Circle" },
        ],
      },
    ]);
  };

  const removeFollowUp = (idx: number) => {
    setFollowUps((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePrompt = (idx: number, value: string) => {
    setPrompts((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };

  const addPrompt = () => setPrompts((prev) => [...prev, "New prompt"]);
  const removePrompt = (idx: number) => setPrompts((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground font-medium">Preview mode</p>
        <p className="text-xs text-muted-foreground mt-1">
          Changes made here are previewed in real-time but will reset on page refresh. To make permanent changes, contact the site administrator to update the configuration file.
        </p>
      </div>

      {/* A. Pipeline Stage Questions */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Pipeline Stage Questions</h3>
        <div className="space-y-3">
          {stages.map((stage, sIdx) => (
            <Collapsible key={stage.id}>
              <CollapsibleTrigger className="w-full flex items-center gap-2 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors text-left">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground flex-1 truncate">{stage.label}</span>
                <span className="text-xs text-muted-foreground font-mono">{stage.id}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-lg p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Stage label (student-facing button text)</label>
                  <Input
                    value={stage.label}
                    onChange={(e) => updateStage(sIdx, { label: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Drill-down question</label>
                  <Input
                    value={stage.drilldownQuestion}
                    onChange={(e) => updateStage(sIdx, { drilldownQuestion: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Drill-down options</label>
                  <div className="space-y-2 mt-2 pl-4 border-l-2 border-border">
                    {stage.drilldownOptions.map((opt, oIdx) => (
                      <div key={opt.id} className="flex items-start gap-2">
                        <Input
                          value={opt.label}
                          onChange={(e) => updateStageOption(sIdx, oIdx, e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground font-mono mt-2.5 shrink-0">{opt.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Resource recommendation</label>
                  <Textarea
                    value={stage.resourceNudge}
                    onChange={(e) => updateStage(sIdx, { resourceNudge: e.target.value })}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* B. Follow-up Questions */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Follow-up Questions</h3>
        <div className="space-y-3">
          {followUps.map((q, qIdx) => (
            <Collapsible key={q.id + qIdx}>
              <div className="flex items-center gap-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveFollowUp(qIdx, -1)}
                    disabled={qIdx === 0}
                    className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveFollowUp(qIdx, 1)}
                    disabled={qIdx === followUps.length - 1}
                    className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <CollapsibleTrigger className={`flex-1 flex items-center gap-2 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors text-left ${(q as FollowUpData).disabled ? "opacity-50" : ""}`}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground flex-1 truncate">{q.question}</span>
                </CollapsibleTrigger>
                <button
                  onClick={() => updateFollowUp(qIdx, { disabled: !(q as FollowUpData).disabled } as Partial<FollowUpData>)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                  title={(q as FollowUpData).disabled ? "Enable" : "Disable"}
                >
                  {(q as FollowUpData).disabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => removeFollowUp(qIdx)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CollapsibleContent className="ml-7 border border-t-0 border-border rounded-b-lg p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Question text</label>
                  <Input
                    value={q.question}
                    onChange={(e) => updateFollowUp(qIdx, { question: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Options</label>
                  <div className="space-y-2 mt-2 pl-4 border-l-2 border-border">
                    {q.options.map((opt, oIdx) => (
                      <div key={opt.id} className="flex items-start gap-2">
                        <Input
                          value={opt.label}
                          onChange={(e) => updateFollowUpOption(qIdx, oIdx, e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground font-mono mt-2.5 shrink-0">{opt.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        {followUps.length < 8 && (
          <Button variant="outline" size="sm" className="mt-3" onClick={addFollowUp}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add follow-up question
          </Button>
        )}
      </div>

      {/* C. Continue Prompts */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Continue Prompts</h3>
        <p className="text-xs text-muted-foreground mb-3">Messages shown between follow-up questions to encourage students to keep going.</p>
        <div className="space-y-2">
          {prompts.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={p}
                onChange={(e) => updatePrompt(idx, e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removePrompt(idx)}
                className="p-2 text-muted-foreground hover:text-destructive"
                disabled={prompts.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addPrompt}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add prompt
        </Button>
      </div>
    </div>
  );
};

export default SurveyEditor;
