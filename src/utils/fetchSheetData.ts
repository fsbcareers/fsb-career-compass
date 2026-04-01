import Papa from "papaparse";
import { SHEET_CSV_URL, USE_MOCK_DATA } from "@/config/adminConfig";
import { generateMockData, type SurveyResponse } from "./generateMockData";

export async function fetchSheetData(): Promise<SurveyResponse[]> {
  if (USE_MOCK_DATA || !SHEET_CSV_URL) {
    return generateMockData(200);
  }

  const res = await fetch(SHEET_CSV_URL);
  const csv = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse<SurveyResponse>(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });
}
