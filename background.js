import CONFIG from "./CONFIG.js";

async function broadcastSashimiState(on = true, text = CONFIG.ON) {
    await chrome.storage.local.set({ on });
    chrome.action.setBadgeText({ text });
}

async function initSashimi() {
    const state = await chrome.storage.local.get(["on"]);
    if (state.on === undefined) {
        await broadcastSashimiState();
    } else {
        await broadcastSashimiState(state.on, state.on ? CONFIG.ON : CONFIG.OFF);
    }
}

chrome.runtime.onInstalled.addListener(initSashimi);
chrome.runtime.onStartup.addListener(initSashimi);

chrome.action.onClicked.addListener(async (tab) => {
    const state = await chrome.storage.local.get(["on"]);
    await broadcastSashimiState(!state.on, state.on ? CONFIG.OFF : CONFIG.ON);
});
