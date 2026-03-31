const WEBHOOK_URL = ""; // Replace with Google Apps Script URL

interface SaveResult {
  rowId: string | null;
}

export async function saveAnswer(
  rowId: string | null,
  field: string,
  value: string
): Promise<SaveResult> {
  if (!WEBHOOK_URL) {
    console.log(`[saveAnswer] ${rowId ? `row_id=${rowId}` : "new row"} | ${field}=${value}`);
    // Simulate a row_id for dev
    return { rowId: rowId || `dev-${Date.now()}` };
  }

  try {
    const body = rowId
      ? { row_id: rowId, field, value }
      : { [field]: value };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return { rowId: data.row_id?.toString() || rowId };
  } catch (error) {
    console.warn("[saveAnswer] Failed silently:", error);
    return { rowId: rowId || `fallback-${Date.now()}` };
  }
}
