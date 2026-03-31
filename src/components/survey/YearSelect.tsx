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
  return (
    <div className="animate-slide-in-left">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        What year are you?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {years.map((year) => (
          <button
            key={year.id}
            onClick={() => onSelect(year.id)}
            className="flex flex-col items-center justify-center min-h-[80px] py-4 px-4 rounded-lg border border-survey-button-border bg-survey-button-bg hover:bg-survey-button-hover transition-colors"
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
