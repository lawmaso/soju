/**
 * @file src/background/offscreen-client.js
 * 
 * Inits the offscreen document at most once,
 * handling race conditions + concurrency safely.
 * 
 * The offscreen document is needed to access the DOM
 * in MV3 architecture extensions.
 */

export function createOffscreenClient(chrome) {
    let creating = null;

    return async function ensureOffscreen(path) {
        const url = chrome.runtime.getURL(path);

        const existing = await chrome.runtime.getContexts({
            contextTypes: ["OFFSCREEN_DOCUMENT"],
            documentUrls: [url]
        });
        if (existing.length > 0) {
            return;
        }

        if (!creating) {
            creating = chrome.offscreen.createDocument({
                url: path,
                reasons: ["AUDIO_PLAYBACK"],
                justification: "Play app toggle sound"
            })
                .finally(() => {
                    creating = null;
                });
        }
        await creating;
    };
}
