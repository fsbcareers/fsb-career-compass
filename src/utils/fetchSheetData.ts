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

  try {
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

    // Filter out rows with empty class_year (incomplete/abandoned)
    const filtered = parsed.filter((r) => r.class_year && String(r.class_year).trim() !== "");

    return { data: filtered, fetchedAt: new Date(), isMock: false };
  } catch (error) {
    console.error("[Admin] CSV fetch failed, falling back to mock data:", error);
    return { data: generateMockData(200), fetchedAt: new Date(), isMock: true };
  }
}
