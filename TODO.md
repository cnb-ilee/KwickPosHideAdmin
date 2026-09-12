# TODO: Convert Userscript to Chrome Extension & Package for Distribution

## Phase 1: Convert Userscript to Chrome Extension
- [ ] Create a local project folder (e.g., `company-extension`).
- [ ] Create a `content.js` file.
  - [ ] Copy the original JavaScript code into this file.
  - [ ] Remove the old Tampermonkey metadata block (`// ==UserScript==` to `// ==/UserScript==`).
- [ ] Create a `manifest.json` file using Manifest V3 syntax.
  - [ ] Configure `manifest_version`: `3`.
  - [ ] Define `name`, `version`, and `description`.
  - [ ] Map the website match patterns under `content_scripts.matches` (replace original `@match` parameters).
  - [ ] Map `content_scripts.js` to point to `content.js`.

## Phase 2: Host the Files (Internal Web Server)
- [ ] Set up an internal, secure HTTPS hosting directory (e.g., `https://internal.mycompany.com/extension/`).
- [ ] Create an `update.xml` file for self-hosting updates.
  - [ ] Structure the XML with `<gupdate>` and `<app>` tags.
  - [ ] Leave placeholders for `appid` and `codebase` URL to fill in after packing.

## Phase 3: Pack the Extension & Retrieve ID
- [ ] Open Google Chrome and navigate to `chrome://extensions/`.
- [ ] Toggle **Developer mode** (top-right corner) to ON.
- [ ] Click **Pack extension** (top-left).
- [ ] Set **Extension root directory** to your local project folder.
- [ ] Click **Pack extension** (leave private key blank for the first time).
- [ ] Securely back up the generated `.pem` private key file (needed for future updates).
- [ ] Drag the newly created `.crx` file into Chrome to temporarily install it.
- [ ] Copy the unique 32-character **Extension ID** from the extension details.

## Phase 4: Finalize Server Configuration
- [ ] Open the hosted `update.xml` file.
  - [ ] Update `appid` with the exact 32-character Extension ID.
  - [ ] Update `codebase` to point directly to the hosted `.crx` file URL.
- [ ] Upload both `your-extension.crx` and `update.xml` to your internal web server.

## Phase 5: Enterprise Deployment
- [ ] Access your endpoint management tool (Active Directory GPO, Intune, or Registry script).
- [ ] Navigate to the Chrome Policy path:
  `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist`
- [ ] Create or update a String Value (REG_SZ) entries.
- [ ] Format the value string exactly as: `[EXTENSION_ID];[UPDATE_XML_URL]`
  *(e.g., abcdefghijklmnopqrstuvwxyzabcdef;https://internal.mycompany.com/extension/update.xml)*
- [ ] Push the policy updates to target organizational machines.
- [ ] Verify execution by checking `chrome://policy` on a client computer to ensure the extension force-installs silently.
