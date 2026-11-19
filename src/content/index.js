/**
 * @file src/content/index.js
 * 
 * The entry point for content scripts.
 * 
 * Utilizes a global flag to prevent duplicate
 * initialization if a content script is injected
 * multiple times into the same context.
 */

import CONFIG from "../config";
import { createToggler } from "./toggler";

const LOADED_FLAG = "__sojuLoaded";

if (!globalThis[LOADED_FLAG]) {
    globalThis[LOADED_FLAG] = true;

    const toggler = createToggler({
        document,
        MutationObserver,
        styleId: CONFIG.SOJU_ID
    });

    // Listen for messages from the service worker
    chrome.runtime.onMessage.addListener((message) => {
        if (typeof message?.on === "boolean") {
            toggler.apply(message.on);
        }
    });

    // Apply previously stored state
    chrome.storage.local.get([CONFIG.STORAGE_KEY]).then((stored) => {
        toggler.apply(stored[CONFIG.STORAGE_KEY]);
    });
}
