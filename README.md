# KwickPOS - Hide Admin Sidebar (Tampermonkey Script)

A Tampermonkey userscript designed specifically for **KwickPOS** (`*.kwickpos.com`) to automatically collapse the left admin sidebar (`mylog` frame) when running in client mode, maximizing screen real estate for POS operations while providing an easy toggle button to access admin settings when needed.

> **Note:** This script is designed for use with the **[Tampermonkey](https://www.tampermonkey.net/)** extension on Google Chrome (or other Chromium-based browsers).

---

## Features

- **Automatic Collapse:** Automatically collapses the admin frame (`mylog`) to `1%` on page load, giving `99%` width to the main register window (`mywin`).
- **One-Click Toggle Button:** Injects a compact green toggle button (`▶` / `◀`) in the top-left corner of the main window so authorized users can easily expand the admin menu (to `20%`) or collapse it again anytime.
- **Conditional Activation:** Only triggers if the admin frame (`mylog`) is detected, preventing interference with pages that do not use the frameset structure.
- **POS Access in new Tab** When you click POS Access it will now bring a new tab rather than a pop-up.  Tab name will be merchant name as well.

---

## Prerequisites

1. Google Chrome (or Microsoft Edge / Brave / any Chromium browser).
2. The **Tampermonkey** extension installed.
   - [Install Tampermonkey from Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
3. Turn on Allow User Scripts for **Tampermonkey** extension
   - Extensions -> Manage extensions -> Tampermonkey -> Details -> Allow User Scripts

---

## Installation & Setup Instructions

Follow these step-by-step instructions to install and activate the script:

### Step 1: Greasy Fork Page for Resize & Toggle KwickPOS Admin Frameset to install the script
   - [Install Left Admin Section on KwickPOS Script](https://greasyfork.org/en/scripts/597436-resize-toggle-kwickpos-admin-frameset)

### Step 2: Greasy Fork Page for new Tab page for POS Access to install the script
   - [Install New Tab instead of Pop Up Script](https://greasyfork.org/en/scripts/597843-kwickpos-pos-access-in-new-tab)

### Step 3: Check if both script are enabled in **Tampermonkey** extension

### Step 4: Test on KwickPOS

1. Open your KwickPOS web interface (`https://*.kwickpos.com/*`).
2. The admin frame on the left will automatically collapse to a thin 1% strip.
3. Look for the small green arrow button (`▶`) near the top-left corner:
   - Click **`▶`** to expand the admin sidebar.
   - Click **`◀`** to collapse it back.
4. When you click POS Access, it should create a new tab with the merchant name instead of pop-up
---

## Matching Domains

This script is configured to run specifically on:

- `*://kwickpos.com/*`
- `*://*.kwickpos.com/*`

If your KwickPOS terminal runs on a custom local IP address or local hostname, add an extra `@match` line in the userscript header block (e.g., `// @match http://192.168.1.*/*`).
