/**
 * @file src/shared/messages.js
 * 
 * Message shapes passed between the service worker,
 * content scripts, and the offscreen document.
 */

export const OFFSCREEN_TARGET = "offscreen";

export function stateMessage(on) {
    return { on };
}

export function soundMessage(on) {
    return {
        target: OFFSCREEN_TARGET,
        soundTarget: on ? "on" : "off"
    };
}

export function isSoundMessage(message) {
    return message?.target === OFFSCREEN_TARGET;
}
