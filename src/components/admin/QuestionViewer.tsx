import { surveyConfig } from "@/config/surveyConfig";
import { icons } from "lucide-react";

const QuestionViewer = () => {
  const getIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent size={14} className="inline mr-1" /> : null;
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Survey Configuration</h3>
      <p className="text-xs text-muted-foreground mb-4">
        To edit questions, update surveyConfig.ts and redeploy.
      </p>

      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Pipeline Stages</h4>
        {surveyConfig.pipelineStages.map((stage) => (
          <div key={stage.id} className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground">{stage.shortLabel}: {stage.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{stage.drilldownQuestion}</p>
            <ul className="mt-2 space-y-1">
              {stage.drilldownOptions.map((opt) => (
                <li key={opt.id} className="text-xs text-foreground pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                  {opt.label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-primary mt-2 italic">💡 {stage.resourceNudge}</p>
          </div>
        ))}

        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mt-6">Follow-up Questions</h4>
        {surveyConfig.followUpQuestions.map((q, i) => (
          <div key={q.id} className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground">
              {i + 1}. {q.question}
            </p>
            <ul className="mt-2 space-y-1">
              {q.options.map((opt) => (
                <li key={opt.id} className="text-xs text-foreground pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionViewer;
