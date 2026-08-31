import CONFIG from "./config.js";

let creating;
async function setupOffscreen(path) {
    const url = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [url]
    });

    if (existingContexts.length == 0) {
        if (creating) {
            await creating;
        } else {
            creating = chrome.offscreen.createDocument({
                url: path,
                reasons: ["AUDIO_PLAYBACK"],
                justification: "Play toggle sound"
            });
            await creating;
            creating = null;
        }
    }
}

async function broadcastSojuState(on = true, text = CONFIG.ON) {
    await chrome.storage.local.set({ on });
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: on ? CONFIG.ON_COLOR : CONFIG.OFF_COLOR });

    // Notify relevant tabs, then inject if message failed
    const tabs = await chrome.tabs.query({ url: CONFIG.MATCHES });
    for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { on }).catch((err) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["soju.js"],
                injectImmediately: true
            })
                .then(() => {})
                .catch((err) => {});
        });
    }

    // Send message to offscreen
    await setupOffscreen("offscreen.html");
    chrome.runtime.sendMessage({
        target: "offscreen",
        soundTarget: on ? "on" : "off"
    });
}

// Initializes app
async function initSoju() {
    const state = await chrome.storage.local.get(["on"]);
    if (state.on === undefined) {
        await broadcastSojuState();
    } else {
        await broadcastSojuState(state.on, state.on ? CONFIG.ON : CONFIG.OFF);
    }
}

// Init app on installation + startup
chrome.runtime.onInstalled.addListener(initSoju);
chrome.runtime.onStartup.addListener(initSoju);

async function toggleSoju() {
    const state = await chrome.storage.local.get(["on"]);
    await broadcastSojuState(!state.on, state.on ? CONFIG.OFF : CONFIG.ON);
}

// Handle toggles
chrome.action.onClicked.addListener(toggleSoju);
chrome.commands.onCommand.addListener(toggleSoju);
