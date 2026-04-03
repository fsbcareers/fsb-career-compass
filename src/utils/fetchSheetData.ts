import Papa from "papaparse";
import { SHEET_CSV_URL, USE_MOCK_DATA } from "@/config/adminConfig";
import { generateMockData, type SurveyResponse } from "./generateMockData";

export interface FetchResult {
  data: SurveyResponse[];
  fetchedAt: Date;
  isMock: boolean;
}

export async function fetchSheetData(): Promise<FetchResult> {
  if (USE_MOCK_DATA || !SHEET_CSV_URL) {
    return { data: generateMockData(200), fetchedAt: new Date(), isMock: true };
  }

  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const csv = await res.text();

  const parsed = await new Promise<SurveyResponse[]>((resolve, reject) => {
    Papa.parse<SurveyResponse>(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });

  const filtered = parsed.filter((r) => r.class_year && String(r.class_year).trim() !== "");

  return { data: filtered, fetchedAt: new Date(), isMock: false };
}
