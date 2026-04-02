

## Plan: Connect Google Apps Script Webhook & Update Deployment URLs

### What this does
Connects the survey to your Google Sheet so every student response gets saved automatically, and updates all URLs to point to the correct deployed site.

### Changes

**1. Set the webhook URL** (`src/config/webhookConfig.ts`)
- Set `WEBHOOK_URL` to `https://script.google.com/macros/s/AKfycbxwsjQmWXyk5_RCimth49KsZ0q1CgHAASZDQ0K0lDUXkDXmDxTWN0H27CzyKBrGsd0cKA/exec`

**2. Update the base URL for QR codes and email snippets** (`src/config/adminConfig.ts`)
- Set `BASE_URL` to `https://fsbcareers.github.io/fsb-career-compass`

After these two one-line changes, survey submissions will flow to your Google Sheet and all generated links/QR codes will point to the correct deployed URL.

