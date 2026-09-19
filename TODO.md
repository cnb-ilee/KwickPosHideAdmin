# TODO: Convert Userscript to Chrome Extension & Package for Distribution

## Phase 1: Convert Userscript to Chrome Extension
- [x] Create a local project folder (`company-extension`).
- [x] Create a `content.js` file.
  - [x] Copy the original JavaScript code into this file.
  - [x] Remove the old Tampermonkey metadata block (`// ==UserScript==` to `// ==/UserScript==`).
- [x] Create a `manifest.json` file using Manifest V3 syntax.
  - [x] Configure `manifest_version`: `3`.
  - [x] Define `name`, `version`, and `description`.
  - [x] Map the website match patterns under `content_scripts.matches` (replace original `@match` parameters).
  - [x] Map `content_scripts.js` to point to `content.js`.

## Phase 2: Host the Files (Internal Web Server)
- [x] Skipped per request.
- [x] Skip creating `update.xml` because hosting is out of scope for this step.

## Phase 3: Pack the Extension & Retrieve ID
- [x] Pack the extension with Chrome's command-line packer.
- [x] Use `company-extension` as the extension root directory.
- [x] Leave the private key blank for the first pack.
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
