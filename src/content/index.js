/**
 * @file src/content/index.js
 * 
 * The entry point for content scripts.
 */

import { createToggler } from "./toggler";
const LOADED_FLAG = "__sojuLoaded";

if (!globalThis[LOADED_FLAG]) {
    globalThis[LOADED_FLAG] = true;

    const toggler = createToggler({
        document,
        MutationObserver,
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (typeof message?.on === "boolean") {
            toggler.apply(message.on);
        }
    });
}
