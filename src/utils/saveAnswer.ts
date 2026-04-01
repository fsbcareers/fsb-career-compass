import { WEBHOOK_URL } from "@/config/webhookConfig";

interface SaveResult {
  row_id: string | null;
}

export async function saveAnswer(
  rowId: string | null,
  field: string,
  value: string
): Promise<SaveResult> {
  if (!WEBHOOK_URL) {
    console.log(`[Survey] Save: ${field} = ${value} (row: ${rowId || "new"})`);
    return { row_id: rowId || `local_${Date.now()}` };
  }

  try {
    const payload = rowId
      ? { row_id: rowId, field, value }
      : { value };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "text/plain" },
    });

    const data = await response.json();
    return { row_id: data.row_id || rowId };
  } catch (error) {
    console.error("[Survey] Save failed:", error);
    return { row_id: rowId || `error_${Date.now()}` };
  }
}
