/**
 * @file test/selectors.test.js
 */

// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";

import {
    OVERVIEW_CHILD_SELECTOR,
    SIDE_PANEL_SELECTOR,
    buildSelectors,
    buildCSS
} from "../src/content/selectors.js";

import { loadFixture } from "./helpers.js";

const overviewChild = () => document.querySelector(OVERVIEW_CHILD_SELECTOR);
const container = () => document.getElementById("overview-container");

describe("buildSelectors", () => {
    beforeEach(() => (document.body.innerHTML = ""));

    it("targets shallow container when overview is in search results", () => {
        loadFixture("serp-in-results.html");
        const selectors = buildSelectors(overviewChild());

        expect(selectors.length).toBe(2);
        expect(selectors).toEqual([SIDE_PANEL_SELECTOR, `div:has(> div > ${OVERVIEW_CHILD_SELECTOR})`]);
        expect(container().matches(selectors[1])).toBe(true);
    });

    it("targets deep container when overview is not int search results", () => {
        loadFixture("serp-above-results.html");
        const selectors = buildSelectors(overviewChild());

        expect(selectors.length).toBe(2);
        expect(selectors[1]).toBe(`div:has(> div > div > div > div > ${OVERVIEW_CHILD_SELECTOR})`);
        expect(container().matches(selectors[1])).toBe(true);
    });

    it("always includes side panel", () => {
        loadFixture("serp-in-results.html");
        expect(document.querySelector(SIDE_PANEL_SELECTOR).id).toBe("side-panel");
    });
});

describe("buildCSS", () => {
    it("joins selectors into one rule", () => {
        expect(buildCSS(["a", "b"])).toBe("a,b{ display: none !important; }");
    });

    it("targets all passed selectors", () => {
        const testSelectors = ["a", "b", "c", "d"];
        const css = buildCSS(testSelectors);

        const rawSelectors = css.split("{")[0];
        for (const selector of testSelectors) {
            expect(rawSelectors.includes(selector)).toBe(true);
        }
    })
});
