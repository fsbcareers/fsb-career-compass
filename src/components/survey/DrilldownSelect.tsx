import { useState } from "react";
import { surveyConfig, type PipelineStage } from "@/config/surveyConfig";
import {
  CloudRain, Clock, BookOpen, HelpCircle,
  GitBranch, EyeOff, Target, Shuffle,
  Monitor, SearchX, Lock, Users,
  FileX, FileMinus, PenTool, Copy,
  ArrowUp, Inbox, XCircle,
  HeartPulse, MessageCircleQuestion, ArrowRightCircle,
  Scale, Pause, Timer, RotateCcw,
} from "lucide-react";

const drilldownIcons: Record<string, Record<string, React.ReactNode>> = {
  not_started: {
    overwhelmed: <CloudRain size={18} />,
    timing_unaware: <Clock size={18} />,
    academic_priority: <BookOpen size={18} />,
    qualification_doubt: <HelpCircle size={18} />,
  },
  career_clarity: {
    too_many_interests: <GitBranch size={18} />,
    low_awareness: <EyeOff size={18} />,
    field_not_roles: <Target size={18} />,
    major_mismatch: <Shuffle size={18} />,
  },
  finding_opportunities: {
    platform_unaware: <Monitor size={18} />,
    relevance_gap: <SearchX size={18} />,
    experience_gap: <Lock size={18} />,
    no_network: <Users size={18} />,
  },
  application_materials: {
    thin_resume: <FileX size={18} />,
    low_confidence: <FileMinus size={18} />,
    no_cover_letter: <PenTool size={18} />,
    no_tailoring: <Copy size={18} />,
  },
  getting_responses: {
    low_volume: <ArrowUp size={18} />,
    high_volume_no_response: <Inbox size={18} />,
    auto_rejected: <XCircle size={18} />,
    visibility_unknown: <EyeOff size={18} />,
  },
  interview_performance: {
    nerves: <HeartPulse size={18} />,
    behavioral_weak: <MessageCircleQuestion size={18} />,
    stalls_at_finals: <ArrowRightCircle size={18} />,
    prep_unclear: <HelpCircle size={18} />,
  },
  evaluating_offers: {
    tradeoff_unclear: <Scale size={18} />,
    lukewarm_offer: <Pause size={18} />,
    time_pressure: <Timer size={18} />,
    regret_aversion: <RotateCcw size={18} />,
  },
};

interface DrilldownSelectProps {
  stageId: string;
  onSelect: (optionId: string) => void;
}

const DrilldownSelect = ({ stageId, onSelect }: DrilldownSelectProps) => {
  const stage = surveyConfig.pipelineStages.find((s) => s.id === stageId) as PipelineStage;
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (optionId: string) => {
    setTapped(optionId);
    setTimeout(() => onSelect(optionId), 150);
  };

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        {stage.drilldownQuestion}
      </h2>
      <div className="flex flex-col gap-[10px]">
        {stage.drilldownOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleTap(option.id)}
            style={{ touchAction: "manipulation" }}
            className={`flex items-center w-full text-left min-h-[56px] py-4 px-4 rounded-lg border transition-all duration-150
              ${
                tapped === option.id
                  ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                  : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
              }
            `}
          >
            <span
              className={`shrink-0 mr-3 transition-colors duration-150 ${
                tapped === option.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {drilldownIcons[stageId]?.[option.id]}
            </span>
            <span className="text-base leading-[1.4] text-foreground">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrilldownSelect;
