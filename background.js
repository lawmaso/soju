import CONFIG from "./CONFIG.js";

async function broadcastSashimiState(on = true, text = CONFIG.ON) {
    await chrome.storage.local.set({ on });
    chrome.action.setBadgeText({ text });
}

chrome.runtime.onInstalled.addListener(async () => {
    const state = await chrome.storage.local.get(["on"]);
    if (state.on === undefined) {
        await broadcastSashimiState();
    } else {
        await broadcastSashimiState(state.on, state.on ? CONFIG.ON : CONFIG.OFF);
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    const state = await chrome.storage.local.get(["on"]);
    await broadcastSashimiState(!state.on, state.on ? CONFIG.OFF : CONFIG.ON);
});
