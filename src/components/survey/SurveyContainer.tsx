import { useState, useCallback } from "react";
import { surveyConfig } from "@/config/surveyConfig";
import { saveAnswer } from "@/utils/saveAnswer";
import ProgressBar from "./ProgressBar";
import SurveyHeader from "./SurveyHeader";
import BackButton from "./BackButton";
import YearSelect from "./YearSelect";
import StageSelect from "./StageSelect";
import DrilldownSelect from "./DrilldownSelect";
import ContinuePrompt from "./ContinuePrompt";
import FollowUpQuestion from "./FollowUpQuestion";
import Confirmation from "./Confirmation";

type Screen =
  | "year"
  | "stage"
  | "drilldown"
  | "continue_prompt"
  | "follow_up"
  | "confirmation";

interface SurveyContainerProps {
  initialYear?: string;
}

const VALID_YEARS = ["freshman", "sophomore", "junior", "senior"];
const MAX_FOLLOW_UPS = surveyConfig.followUpQuestions.length;
const TOTAL_POSSIBLE = 3 + MAX_FOLLOW_UPS; // core + follow-ups

const SurveyContainer = ({ initialYear }: SurveyContainerProps) => {
  const hasValidYear = initialYear && VALID_YEARS.includes(initialYear);

  const [screen, setScreen] = useState<Screen>(hasValidYear ? "stage" : "year");
  const [rowId, setRowId] = useState<string | null>(null);
  const [classYear, setClassYear] = useState<string>(hasValidYear ? initialYear! : "");
  const [stageId, setStageId] = useState("");
  const [questionCount, setQuestionCount] = useState(hasValidYear ? 1 : 0);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [history, setHistory] = useState<Screen[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Save initial year from URL param on first render
  const [initialSaved, setInitialSaved] = useState(false);
  if (hasValidYear && !initialSaved) {
    setInitialSaved(true);
    saveAnswer(null, "class_year", initialYear!).then((r) => setRowId(r.rowId));
  }

  const pushScreen = useCallback(
    (next: Screen) => {
      setDirection("forward");
      setHistory((prev) => [...prev, screen]);
      setScreen(next);
    },
    [screen]
  );

  const goBack = useCallback(() => {
    setDirection("back");
    setHistory((prev) => {
      const copy = [...prev];
      const last = copy.pop();
      if (last) setScreen(last);
      return copy;
    });
  }, []);

  const handleYear = async (year: string) => {
    setClassYear(year);
    const result = await saveAnswer(rowId, "class_year", year);
    setRowId(result.rowId);
    setQuestionCount(1);
    pushScreen("stage");
  };

  const handleStage = async (id: string) => {
    setStageId(id);
    await saveAnswer(rowId, "pipeline_stage", id);
    setQuestionCount((c) => Math.max(c, 2));
    pushScreen("drilldown");
  };

  const handleDrilldown = async (optionId: string) => {
    await saveAnswer(rowId, "bottleneck_detail", optionId);
    setQuestionCount((c) => Math.max(c, 3));
    pushScreen("continue_prompt");
  };

  const handleFollowUp = async (optionId: string) => {
    const fieldName = surveyConfig.followUpQuestions[followUpIndex].id;
    await saveAnswer(rowId, fieldName, optionId);
    const newCount = 4 + followUpIndex;
    setQuestionCount(newCount);
    await saveAnswer(rowId, "question_count", newCount.toString());

    const nextIndex = followUpIndex + 1;
    if (nextIndex >= MAX_FOLLOW_UPS) {
      pushScreen("confirmation");
    } else {
      setFollowUpIndex(nextIndex);
      // If this was the 4th follow-up (index 3), skip prompt and go to last
      if (nextIndex === MAX_FOLLOW_UPS - 1) {
        pushScreen("follow_up");
      } else {
        pushScreen("continue_prompt");
      }
    }
  };

  const handleContinue = () => {
    pushScreen("follow_up");
  };

  const handleDone = async () => {
    await saveAnswer(rowId, "question_count", questionCount.toString());
    pushScreen("confirmation");
  };

  const handleRestart = () => {
    setScreen("year");
    setRowId(null);
    setClassYear("");
    setStageId("");
    setQuestionCount(0);
    setFollowUpIndex(0);
    setHistory([]);
    setInitialSaved(false);
  };

  const progress = questionCount / TOTAL_POSSIBLE;
  const showBack = screen !== "year" && screen !== "confirmation" && history.length > 0;

  const animationClass = direction === "forward" ? "animate-slide-in-left" : "animate-slide-in-right";

  return (
    <div className="min-h-screen bg-survey-bg flex justify-center">
      <div className="w-full max-w-[480px]">
        <ProgressBar progress={progress} />
        <SurveyHeader />
        <div className="px-5 pb-10">
          {showBack && (
            <div className="mb-4">
              <BackButton onBack={goBack} />
            </div>
          )}
          <div key={`${screen}-${followUpIndex}`} className={screen === "confirmation" ? "" : animationClass}>
            {screen === "year" && <YearSelect onSelect={handleYear} />}
            {screen === "stage" && <StageSelect onSelect={handleStage} />}
            {screen === "drilldown" && (
              <DrilldownSelect stageId={stageId} onSelect={handleDrilldown} />
            )}
            {screen === "continue_prompt" && (
              <ContinuePrompt
                prompt={surveyConfig.continuePrompts[Math.min(followUpIndex, surveyConfig.continuePrompts.length - 1)]}
                onContinue={handleContinue}
                onDone={handleDone}
              />
            )}
            {screen === "follow_up" && (
              <FollowUpQuestion
                questionIndex={followUpIndex}
                onSelect={handleFollowUp}
              />
            )}
            {screen === "confirmation" && (
              <Confirmation stageId={stageId} onRestart={handleRestart} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyContainer;
