const ON = "ON";
const OFF = "OFF";
const URL_PATTERN = "https://*.google.com/search*";

async function broadcastSashimiState(on = true, text = ON) {
    await chrome.storage.local.set({ on });
    chrome.action.setBadgeText({ text });

    const tabs = await chrome.tabs.query({ url: URL_PATTERN });
    for (const tab of tabs) {
        chrome.scripting.executeScript({
            files: ["sashimi.js"],
            target: { tabId: tab.id }
        });
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    const state = await chrome.storage.local.get(["on"]);
    if (state.on === undefined) {
        await broadcastSashimiState();
    } else {
        await broadcastSashimiState(state.on, state.on ? ON : OFF);
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    const state = await chrome.storage.local.get(["on"]);
    await broadcastSashimiState(!state.on, state.on ? OFF : ON);
});
