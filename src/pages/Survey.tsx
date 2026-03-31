import { useSearchParams } from "react-router-dom";
import SurveyContainer from "@/components/survey/SurveyContainer";

const Survey = () => {
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year") ?? undefined;

  return <SurveyContainer initialYear={year?.toLowerCase()} />;
};

export default Survey;
