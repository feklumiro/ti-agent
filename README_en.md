# <img src="public/icons/128.png" width="40" align="top"> Browser TI-Agent

Browser-based Threat Intelligence (TI) agent that analyzes visited pages and checks their safety using **VirusTotal** and **Kaspersky** APIs.  
It also includes customizable settings (used sources, notification toggles, whitelist, etc.) and supports mobile devices.

## Installation and Launch

1. Clone the repository to your device.
2. Navigate to the project folder.
3. Make sure `npm` version **9.1.0** or higher is installed:
   ```bash
   $ npm --version
   10.9.2
   ```
4. To run development mode (with auto-rebuild), execute:
   ```bash
   $ npm run watch
   ```

   Example output:
   ```
   > my-extension@0.1.0 watch
   > webpack --mode=development --watch --config config/webpack.config.js

   hidden assets 41.1 KiB 4 assets
    asset contentScript.js 7.57 KiB [emitted] (name: contentScript) 1 related asset
    asset popup.js 5.4 KiB [emitted] (name: popup) 1 related asset
    asset popup.css 3.37 KiB [emitted] (name: popup) 1 related asset
    asset background.js 1.46 KiB [emitted] (name: background) 1 related asset
    asset popup.html 1.15 KiB [compared for emit] [from: public/popup.html] [copied]
    asset manifest.json 636 bytes [compared for emit] [from: public/manifest.json] [copied]
    2025-04-17 12:06:47: webpack compiled
   ```

5. To build the extension for production/publishing, execute:
   ```bash
   $ npm run build
   ```

   Example output:
   ```bash
   > my-extension@0.1.0 build
   > webpack --mode=production --config config/webpack.config.js

   webpack compiled successfully
   ```

## How It Works

### Code Structure

All JavaScript code is distributed among three main files:
- **background.js** – runs in the background from the moment the extension is installed.
- **contentScript.js** – runs on page load and analyzes the content.
- **popup.js** – activates when the user clicks the extension icon to open the settings menu.

#### contentScript.js:
This script handles the core logic of the extension. In the main async function at the end of the file:
1. `updStorage()` is called to set initial settings on first launch.
2. Current settings are retrieved from `chrome.storage.sync`.
3. A message is sent to **background.js** to query the external API.
4. `checkStatus()` is called to determine the domain’s safety.
5. `alerting()` displays warnings to the user if needed.

The script also includes a listener that receives requests from **popup.js** and sends the current domain.

#### background.js
This script is responsible for communicating with external APIs.  
It includes a listener that receives messages from **contentScript.js**, queries VirusTotal or Kaspersky based on request type, and returns the response.

#### popup.js
Handles the settings menu UI.  
Includes an async function that creates event listeners for toggles and buttons, updates `chrome.storage.sync`, and sets initial values.

## Extension

The extension is published and available for installation from the [**Chrome Web Store**](https://chromewebstore.google.com/detail/browser-ti-agent/cmnbbfaalckdmfnpoffpobdlhbpomdjk)

## Contribution

Suggestions and pull requests are welcomed!

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)