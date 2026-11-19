/**
 * @file test/state.test.js
 */

import { describe, it, expect } from "vitest";

import CONFIG from "../src/config.js";
import { badgeFor, initialState, nextState } from "../src/shared/state.js";
import { stateMessage, soundMessage, isSoundMessage } from "../src/shared/messages.js"

describe("badgeFor", () => {
    it("returns the correct badge metadata for each state", () => {
        let badge = badgeFor(true, CONFIG);
        expect(badge).toEqual({ text: CONFIG.ON_TEXT, color: CONFIG.ON_COLOR });
        
        badge = badgeFor(false, CONFIG);
        expect(badge).toEqual({ text: CONFIG.OFF_TEXT, color: CONFIG.OFF_COLOR });
    });
});

describe("initialState", () => {
    it("inits to on when no state is stored", () => expect(initialState(undefined)).toBe(true));

    it("inits to stored values", () => {
        expect(initialState(false)).toBe(false);
        expect(initialState(true)).toBe(true);
    });
});

describe("nextState", () => {
    it("inverts the stored state", () => {
        expect(nextState(false)).toBe(true);
        expect(nextState(true)).toBe(false);
    });

    it("treats the unset state as off", () => {
        expect(nextState(undefined)).toBe(true);
    });
});

describe("messages", () => {
    it("builds state and sound messages", () => {
        expect(stateMessage(true)).toEqual({ on: true });
        expect(stateMessage(false)).toEqual({ on: false });
    });

    it("recognizes only sound messages", () => {
        expect(isSoundMessage(soundMessage(true))).toBe(true);
        expect(isSoundMessage(stateMessage(true))).toBe(false);
        expect(isSoundMessage(undefined)).toBe(false);
    });
});
