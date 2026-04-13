

## Plan: Update Google Sheet CSV URL

### Problem
The admin dashboard is fetching data from the wrong Google Sheet. The configured URL doesn't match the sheet where responses are actually being saved.

### Change

**File: `src/config/adminConfig.ts`**
- Replace the `SHEET_CSV_URL` value with the correct published CSV URL derived from your sheet:
  `https://docs.google.com/spreadsheets/d/e/2PACX-1vSrXf9dLUC-002hcNTXXNOyj7gobfImsu4IHs7CrcxusD8DQLJ_BC4hv9TUP7nOcDTEnM2_6TQHQ5qD/pub?gid=0&single=true&output=csv`

That's it — one line change. After this, the dashboard will pull the 10 real responses from your actual Google Sheet.

