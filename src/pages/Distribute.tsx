import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BASE_URL } from "@/config/adminConfig";

const years = ["freshman", "sophomore", "junior", "senior"];
const yearLabels: Record<string, string> = {
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
};

const Distribute = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const generalUrl = `${BASE_URL}/survey`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>FSB QR Codes</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 40px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; }
        .item { text-align: center; page-break-inside: avoid; }
        .label { font-size: 18px; font-weight: 600; margin-top: 12px; text-transform: capitalize; }
        .url { font-size: 10px; color: #666; margin-top: 4px; word-break: break-all; }
        .general { text-align: center; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #ddd; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1 style="text-align:center;font-size:16px;color:#666;margin-bottom:20px">FSB Career Diagnostic - QR Codes</h1>
      <div class="general">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generalUrl)}" width="200" height="200"/>
        <div class="label">General (all years)</div>
        <div class="url">${generalUrl}</div>
      </div>
      <div class="grid">
        ${years.map((y) => {
          const url = `${BASE_URL}/survey?year=${y}`;
          return `<div class="item"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" width="200" height="200"/><div class="label">${y}</div><div class="url">${url}</div></div>`;
        }).join("")}
      </div></body></html>
    `);
    w.document.close();
    w.print();
  };

  const fullEmailSnippet = `Not sure where to start with your internship search? Take 15 seconds to tell us where you're stuck and we'll point you to the right resources.\n\nFRESHMAN? Start here → ${BASE_URL}/survey?year=freshman\nSOPHOMORE? Start here → ${BASE_URL}/survey?year=sophomore\nJUNIOR? Start here → ${BASE_URL}/survey?year=junior\nSENIOR? Start here → ${BASE_URL}/survey?year=senior`;

  const fullEmailHtml = `<p>Not sure where to start with your internship search? Take 15 seconds to tell us where you're stuck and we'll point you to the right resources.</p>
<p>
  <a href="${BASE_URL}/survey?year=freshman">FRESHMAN? Start here →</a><br/>
  <a href="${BASE_URL}/survey?year=sophomore">SOPHOMORE? Start here →</a><br/>
  <a href="${BASE_URL}/survey?year=junior">JUNIOR? Start here →</a><br/>
  <a href="${BASE_URL}/survey?year=senior">SENIOR? Start here →</a>
</p>`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[700px] mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Farmer School of Business
          </p>
          <h1 className="text-xl font-semibold text-foreground mt-1">Help us reach more students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Grab a QR code or email link to share the FSB career diagnostic with your students.
          </p>
        </div>

        {/* Explanation */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mb-8">
          <p className="text-sm text-foreground leading-relaxed">
            The Farmer School career center is running a quick diagnostic to understand where students are getting stuck in the internship search. It takes 15 seconds to complete and helps us direct resources where students need them most. You can help by sharing the link with your class, club, or organization using the tools below.
          </p>
        </div>

        {/* General QR Code */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-foreground mb-4">General Link (all class years)</h2>
          <div className="flex flex-col items-center p-6 rounded-lg border border-border">
            <QRCodeSVG value={generalUrl} size={140} />
            <p className="text-sm font-medium text-foreground mt-3">All Students</p>
            <p className="text-[11px] text-muted-foreground break-all text-center mt-1">{generalUrl}</p>
            <button
              onClick={() => copyToClipboard(generalUrl, "general")}
              className="text-xs text-primary hover:underline mt-2"
            >
              {copied === "general" ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Year-specific QR Codes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Class-Specific QR Codes</h2>
            <button onClick={handlePrint} className="text-xs text-primary hover:underline">
              Print all QR codes
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {years.map((y) => {
              const url = `${BASE_URL}/survey?year=${y}`;
              return (
                <div key={y} className="flex flex-col items-center p-4 rounded-lg border border-border">
                  <QRCodeSVG value={url} size={100} />
                  <p className="text-sm font-medium text-foreground mt-2">{yearLabels[y]}</p>
                  <p className="text-[10px] text-muted-foreground break-all text-center mt-1">{url}</p>
                  <button
                    onClick={() => copyToClipboard(url, y)}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    {copied === y ? "Copied!" : "Copy link"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Snippets */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-foreground mb-4">Email Snippets</h2>

          {/* Full class email */}
          <div className="rounded-lg border border-border p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Full class email (all years)</span>
              <button
                onClick={() => copyToClipboard(fullEmailHtml, "full_html")}
                className="text-xs text-primary hover:underline"
              >
                {copied === "full_html" ? "Copied!" : "Copy HTML"}
              </button>
            </div>
            <div className="bg-secondary rounded p-3 text-sm text-foreground leading-relaxed">
              <p>Not sure where to start with your internship search? Take 15 seconds to tell us where you're stuck and we'll point you to the right resources.</p>
              <p className="mt-2">
                <a href={`${BASE_URL}/survey?year=freshman`} className="text-primary underline">FRESHMAN? Start here →</a><br />
                <a href={`${BASE_URL}/survey?year=sophomore`} className="text-primary underline">SOPHOMORE? Start here →</a><br />
                <a href={`${BASE_URL}/survey?year=junior`} className="text-primary underline">JUNIOR? Start here →</a><br />
                <a href={`${BASE_URL}/survey?year=senior`} className="text-primary underline">SENIOR? Start here →</a>
              </p>
            </div>
          </div>

          {/* Individual year snippets */}
          {years.map((y) => {
            const url = `${BASE_URL}/survey?year=${y}`;
            const html = `<a href="${url}">${y.toUpperCase()}? Quick career check-in →</a>`;
            return (
              <div key={y} className="rounded-lg border border-border p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize text-foreground">{y}</span>
                  <button
                    onClick={() => copyToClipboard(html, `email_${y}`)}
                    className="text-xs text-primary hover:underline"
                  >
                    {copied === `email_${y}` ? "Copied!" : "Copy HTML"}
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
    </div>
  );
};

export default Distribute;
