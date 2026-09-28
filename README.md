# KwickPOS - Hide Admin Sidebar (Tampermonkey Script)

A Tampermonkey userscript designed specifically for **KwickPOS** (`*.kwickpos.com`) to automatically collapse the left admin sidebar (`mylog` frame) when running in client mode, maximizing screen real estate for POS operations while providing an easy toggle button to access admin settings when needed.

> **Note:** This script is designed for use with the **[Tampermonkey](https://www.tampermonkey.net/)** extension on Google Chrome (or other Chromium-based browsers).

---

## Features

- **Automatic Collapse:** Automatically collapses the admin frame (`mylog`) to `1%` on page load, giving `99%` width to the main register window (`mywin`).
- **One-Click Toggle Button:** Injects a compact green toggle button (`▶` / `◀`) in the top-left corner of the main window so authorized users can easily expand the admin menu (to `20%`) or collapse it again anytime.
- **Conditional Activation:** Only triggers if the admin frame (`mylog`) is detected, preventing interference with pages that do not use the frameset structure.

---

## Prerequisites

1. Google Chrome (or Microsoft Edge / Brave / any Chromium browser).
2. The **Tampermonkey** extension installed.
   - [Install Tampermonkey from Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

---

## Installation & Setup Instructions

Follow these step-by-step instructions to install and activate the script:

### Step 1: Open the Tampermonkey Dashboard

1. Click the **Tampermonkey extension icon** in your Chrome toolbar (click the puzzle piece extensions menu if it is hidden).
2. Select **Dashboard** (or **Create a new script...**).

### Step 2: Create a New Userscript

1. In the Tampermonkey dashboard, click the **`+` (Add a new script)** tab.
2. Select and delete any default template code present in the editor.

### Step 3: Paste the Script Code

1. Copy the entire contents of [`TamperScript.jc`](./TamperScript.jc) from this repository.
2. Paste the code into the Tampermonkey editor window.

### Step 4: Save the Script

1. Click **File** > **Save** in the Tampermonkey editor menu (or press `Ctrl + S`).
2. Verify that the script appears in your **Installed Userscripts** list and is toggled **Enabled (ON)**.

### Step 5: Test on KwickPOS

1. Open or refresh your KwickPOS web interface (`https://*.kwickpos.com/*`).
2. The admin frame on the left will automatically collapse to a thin 1% strip.
3. Look for the small green arrow button (`▶`) near the top-left corner:
   - Click **`▶`** to expand the admin sidebar.
   - Click **`◀`** to collapse it back.

---

## Matching Domains

This script is configured to run specifically on:

- `*://kwickpos.com/*`
- `*://*.kwickpos.com/*`

If your KwickPOS terminal runs on a custom local IP address or local hostname, add an extra `@match` line in the userscript header block (e.g., `// @match http://192.168.1.*/*`).
