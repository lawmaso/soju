/**
 * @file src/shared/state.js
 * 
 * Pure helpers for the various app states.
 */

export function badgeFor(on, config) {
    return on
        ? { text: config.ON_TEXT,  color: config.ON_COLOR }
        : { text: config.OFF_TEXT, color: config.OFF_COLOR };
}

export function initialState(stored) {
    return stored === undefined
        ? true
        : Boolean(stored);
}

export function nextState(stored) {
    return !stored;
}
