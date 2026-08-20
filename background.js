import CONFIG from "./CONFIG.js";

async function broadcastSojuState(on = true, text = CONFIG.ON) {
    await chrome.storage.local.set({ on });
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: on ? CONFIG.ON_COLOR : CONFIG.OFF_COLOR });
}

async function initSoju() {
    const state = await chrome.storage.local.get(["on"]);
    if (state.on === undefined) {
        await broadcastSojuState();
    } else {
        await broadcastSojuState(state.on, state.on ? CONFIG.ON : CONFIG.OFF);
    }
}

chrome.runtime.onInstalled.addListener(initSoju);
chrome.runtime.onStartup.addListener(initSoju);

chrome.action.onClicked.addListener(async (tab) => {
    const state = await chrome.storage.local.get(["on"]);
    await broadcastSojuState(!state.on, state.on ? CONFIG.OFF : CONFIG.ON);
});
