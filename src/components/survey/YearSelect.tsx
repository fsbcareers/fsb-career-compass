import { useState } from "react";

interface YearSelectProps {
  onSelect: (year: string) => void;
}

const years = [
  { id: "freshman", label: "Freshman", sub: "1st year" },
  { id: "sophomore", label: "Sophomore", sub: "2nd year" },
  { id: "junior", label: "Junior", sub: "3rd year" },
  { id: "senior", label: "Senior", sub: "4th year" },
];

const YearSelect = ({ onSelect }: YearSelectProps) => {
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (yearId: string) => {
    setTapped(yearId);
    setTimeout(() => onSelect(yearId), 150);
  };

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-[22px] font-semibold text-foreground mb-6 leading-[1.4]">
        What year are you?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {years.map((year) => (
          <button
            key={year.id}
            onClick={() => handleTap(year.id)}
            style={{ touchAction: "manipulation" }}
            className={`flex flex-col items-center justify-center min-h-[80px] py-4 px-4 rounded-lg border transition-all duration-150
              ${
                tapped === year.id
                  ? "bg-survey-highlight-bg border-primary scale-[0.97]"
                  : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover"
              }
            `}
          >
            <span className="text-base font-medium text-foreground">
              {year.label}
            </span>
            <span className="text-xs text-survey-subtitle mt-1">
              {year.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelect;
