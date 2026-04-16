import { useState } from "react";

interface YearSelectProps {
  onSelect: (year: string) => void;
}

const years = [
  { id: "freshman", label: "Freshman", sub: "1st year", emoji: "🌱" },
  { id: "sophomore", label: "Sophomore", sub: "2nd year", emoji: "📚" },
  { id: "junior", label: "Junior", sub: "3rd year", emoji: "🚀" },
  { id: "senior", label: "Senior", sub: "4th year", emoji: "🎓" },
];

const YearSelect = ({ onSelect }: YearSelectProps) => {
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (yearId: string) => {
    setTapped(yearId);
    setTimeout(() => onSelect(yearId), 180);
  };

  return (
    <div className="animate-slide-in-left">
      <h2 className="text-[24px] font-bold text-foreground mb-2 leading-[1.3]">
        What year are you?
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Tap to get started 👋</p>

      <div className="grid grid-cols-2 gap-3">
        {years.map((year, idx) => (
          <button
            key={year.id}
            onClick={() => handleTap(year.id)}
            style={{
              touchAction: "manipulation",
              animationDelay: `${idx * 60}ms`,
            }}
            className={`animate-float-up flex flex-col items-center justify-center min-h-[100px] py-5 px-4 rounded-xl border-2 transition-all duration-150 active:scale-[0.95]
              ${
                tapped === year.id
                  ? "bg-survey-highlight-bg border-primary scale-[0.97] shadow-md"
                  : "border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover hover:border-muted-foreground/30"
              }
            `}
          >
            <span className="text-2xl mb-1">{year.emoji}</span>
            <span className="text-base font-semibold text-foreground">
              {year.label}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {year.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelect;
