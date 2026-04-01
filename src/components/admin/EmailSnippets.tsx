import { useState } from "react";
import { BASE_URL } from "@/config/adminConfig";

const years = ["freshman", "sophomore", "junior", "senior"];

const EmailSnippets = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copySnippet = (year: string) => {
    const html = `<a href="${BASE_URL}/survey?year=${year}">${year.toUpperCase()}? Quick career check-in →</a>`;
    navigator.clipboard.writeText(html);
    setCopied(year);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-3">Email Snippets</h3>
      <div className="space-y-3">
        {years.map((y) => {
          const url = `${BASE_URL}/survey?year=${y}`;
          const html = `<a href="${url}">${y.toUpperCase()}? Quick career check-in →</a>`;
          return (
            <div key={y} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize text-foreground">{y}</span>
                <button onClick={() => copySnippet(y)} className="text-xs text-primary hover:underline">
                  {copied === y ? "Copied!" : "Copy HTML"}
                </button>
              </div>
              <code className="block text-xs bg-secondary p-2 rounded text-foreground break-all">{html}</code>
              <div className="mt-2 text-sm">
                Preview: <a href={url} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                  {y.toUpperCase()}? Quick career check-in →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmailSnippets;
