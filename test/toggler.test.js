/**
 * @file test/toggler.test.js
*/

// @vitest-environment happy-dom
import { beforeEach, afterEach, describe, expect, it } from "vitest"

import { loadFixture } from "./helpers.js";
import { createToggler } from "../src/content/toggler.js";

const STYLE_ID = "_soju";
const style = () => document.getElementById(STYLE_ID);
const flush = () => new Promise((r) => setTimeout(r, 0))

let toggler;
beforeEach(() => {
    document.body.innerHTML = "";
    toggler = createToggler({
        document,
        MutationObserver,
        styleId: STYLE_ID
    });
});
afterEach(() => toggler.unhide());

describe("hide", () => {
    it("injects one style when the overview is already on the page", () => {
        loadFixture("serp-in-results.html");
        toggler.hide();

        expect(document.querySelectorAll(`#${STYLE_ID}`)).toHaveLength(1);
        expect(style().textContent).toContain("display: none !important;");
        expect(toggler.isObserving()).toBe(false);
    });

    it("waits for an overview that loads later, then stops observing", async () => {
        toggler.hide();
        expect(style()).toBeNull();
        expect(toggler.isObserving()).toBe(true);

        loadFixture("serp-above-results.html");
        await flush();

        expect(style()).not.toBeNull();
        expect(toggler.isObserving()).toBe(false);
    });

    it("does not duplicate style when called multiple times", () => {
        loadFixture("serp-in-results.html");
        for (let i = 0; i < 10; i++) {
            toggler.hide();
        }

        expect(document.querySelectorAll(`#${STYLE_ID}`)).toHaveLength(1);
    });
});

describe("unhide", () => {
    it("removes the style", () => {
        loadFixture("serp-above-results.html");
        toggler.hide();
        toggler.unhide();

        expect(style()).toBeNull();
    });

    it("stops a pending observer so a late overview stays unhidden", async () => {
        toggler.hide();
        toggler.unhide();
        expect(toggler.isObserving()).toBe(false);

        loadFixture("serp-above-results.html");
        await flush();
        expect(style()).toBeNull();
    });
});

describe("apply", () => {
    it("hides when true and unhides when (false|undefined)", () => {
        loadFixture("serp-above-results.html");

        toggler.apply(true);
        expect(style()).not.toBeNull();
        
        toggler.apply(false);
        expect(style()).toBeNull();

        toggler.apply(undefined);
        expect(style()).toBeNull();
    })
});
