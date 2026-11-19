/**
 * @file src/background/index.js
 * 
 * Service worker entry point.
 */

import CONFIG from "../config.js";
import { createBackground } from "./background";

const app = createBackground({ chrome, config: CONFIG });

// Init on install + startup
chrome.runtime.onInstalled.addListener(app.init);
chrome.runtime.onStartup.addListener(app.init);

// Bind toggle to icon + shortcut
chrome.action.onClicked.addListener(app.toggle);
chrome.commands.onCommand.addListener(app.toggle);
