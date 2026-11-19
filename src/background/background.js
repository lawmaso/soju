/**
 * @file src/background/background.js
 * 
 * Background service worker logic.
 */

import { badgeFor, initialState, nextState } from "../shared/state.js";
import { stateMessage, soundMessage } from "../shared/messages.js";
import { createOffscreenClient } from "./offscreen-client.js";

export function createBackground({ chrome, config, logger = console }) {
    const ensureOffscreen = createOffscreenClient(chrome);
    const key = config.STORAGE_KEY;

    async function readState() {
        const stored = await chrome.storage.local.get([key]);
        return stored[key];
    }

    async function notifyTab(tab, on) {
        try {
            await chrome.tabs.sendMessage(tab.id, stateMessage(on));
        } catch {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: [config.CONTENT_SCRIPT],
                    injectImmediately: true
                });
            } catch (err) {
                logger.debug?.(`[SOJU] tab ${tab.id} unreachable:`, err)
            }
        }
    }

    async function applyState(on, { sound = false } = {}) {
        await chrome.storage.local.set({ [key]: on });

        const badge = badgeFor(on);
        await chrome.action.setBadgeText({ text: badge.text });
        await chrome.action.setBadgeBackgroundColor({ color: badge.color });

        const tabs = await chrome.tabs.query({ url: config.MATCHES });
        await Promise.all(tabs.map((tab) => notifyTab(tab, on)));

        if (sound) {
            await ensureOffscreen(config.OFFSCREEN_PAGE);
            await chrome.runtime.sendMessage(soundMessage(on));
        }
    }

    async function init() {
        await applyState(initialState(await readState()));
    }

    async function toggle() {
        await applyState(nextState(await readState()), { sound: config.SOUND_ENABLED });
    }

    return {
        init,
        toggle,
        applyState
    };
}
