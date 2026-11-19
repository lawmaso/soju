/**
 * @file src/config.js
 * 
 * Top-level app config (single source
 * of truth for all other files).
 */

const CONFIG = {
    NAME:           "Soju - AI Overview Toggle",
    DESCRIPTION:    "A simple toggle for hiding AI overviews on Google Search",
    VERSION:        "2.1",
    DEFAULT_TITLE:  "Toggle Soju",
    MATCHES:        ["https://*.google.com/*"],
    SOJU_ID:        "_soju",
    ON:             " ",
    OFF:            "",
    ON_COLOR:       "#5CDB93",
    OFF_COLOR:      "#FFFFFF",
    SOUND_ENABLED:  false,
    STORAGE_KEY:    "on",
    CONTENT_SCRIPT: "content.js",
    OFFSCREEN_PAGE: "offscreen.html"
};

export default CONFIG;
