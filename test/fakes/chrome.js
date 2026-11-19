/**
 * @file test/fakes/chrome.js
 * 
 * A minimal in-memory stand-in for
 * underlying Chrome APIs.
 */

import { vi } from "vitest";

export function createFakeChrome({
    storage = {},
    tabs = [],
    unreachableTabs = []
} = {}) {
    const store = { ...storage };
    const offscreenDocs = new Set();

    const chrome = {
        store,
        storage: {
            local: {
                get: vi.fn(async (keys) =>
                    Object.fromEntries(
                        keys.filter((k) => k in store)
                            .map((k) => [k, store[k]])
                    )
                ),
                set: vi.fn(async (items) => Object.assign(store, items))
            }
        },
        action: {
            setBadgeText: vi.fn(async () => {}),
            setBadgeBackgroundColor: vi.fn(async () => {})
        },
        tabs: {
            query: vi.fn(async () => tabs),
            sendMessage: vi.fn(async (tabId) => {
                if (unreachableTabs.includes(tabId)) {
                    throw new Error("message sent to unreachable tab");
                }
            })
        },
        scripting: {
            executeScript: vi.fn(async () => [])
        },
        runtime: {
            getURL: vi.fn((path) => `chrome-extension://soju/${path}`),
            getContexts: vi.fn(async ({ documentUrls }) =>
                documentUrls.filter((url) => offscreenDocs.has(url))
                    .map((url) => ({ url }))
            ),
            sendMessage: vi.fn(async () => {})
        },
        offscreen: {
            createDocument: vi.fn(async ({ url }) => {
                await new Promise((r) => setTimeout(r, 0));
                offscreenDocs.add(chrome.runtime.getURL(url));
            })
        }
    };

    return chrome;
}
