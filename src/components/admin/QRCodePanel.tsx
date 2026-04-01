import { QRCodeSVG } from "qrcode.react";
import { BASE_URL } from "@/config/adminConfig";
import { useState } from "react";

const years = ["freshman", "sophomore", "junior", "senior"];

const QRCodePanel = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyLink = (year: string) => {
    const url = `${BASE_URL}/survey?year=${year}`;
    navigator.clipboard.writeText(url);
    setCopied(year);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>FSB QR Codes</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 40px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .item { text-align: center; }
        .label { font-size: 18px; font-weight: 600; margin-top: 12px; text-transform: capitalize; }
        .url { font-size: 10px; color: #666; margin-top: 4px; word-break: break-all; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1 style="text-align:center;font-size:16px;color:#666;margin-bottom:30px">FSB Career Diagnostic — QR Codes</h1>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">QR Codes</h3>
        <button onClick={handlePrint} className="text-xs text-primary hover:underline">
          Print all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {years.map((y) => {
          const url = `${BASE_URL}/survey?year=${y}`;
          return (
            <div key={y} className="flex flex-col items-center p-3 rounded-lg border border-border">
              <QRCodeSVG value={url} size={100} />
              <p className="text-sm font-medium text-foreground mt-2 capitalize">{y}</p>
              <p className="text-[10px] text-muted-foreground break-all text-center mt-1">{url}</p>
              <button
                onClick={() => copyLink(y)}
                className="text-xs text-primary hover:underline mt-1"
              >
                {copied === y ? "Copied!" : "Copy link"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QRCodePanel;
