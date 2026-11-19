/**
 * @file src/content/toggler.js
 */

import {
    OVERVIEW_CHILD_SELECTOR,
    buildSelectors,
    buildCSS
} from "./selectors.js";

export function createToggler({
    document,
    MutationObserver,
    styleId,
    childSelector = OVERVIEW_CHILD_SELECTOR
}) {
    let observer = null;

    function stopObserving() {
        observer?.disconnect();
        observer = null;
    }

    function writeStyle(css) {
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement("style");
            style.id = styleId;
            document.documentElement.appendChild(style);
        }
        style.textContent = css;
    }

    function tryInject() {
        const overviewChild = document.querySelector(childSelector);
        if (!overviewChild) {
            return false;
        }

        writeStyle(buildCSS(buildSelectors(
            overviewChild,
            childSelector
        )));
        stopObserving();
        return true;
    }

    function hide() {
        stopObserving();
        if (tryInject()) {
            return;
        }

        observer = new MutationObserver(tryInject);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function unhide() {
        stopObserving();
        document.getElementById(styleId)?.remove();
    }

    function apply(on) {
        on ? hide() : unhide();
    }

    return {
        hide,
        unhide,
        apply,
        isObserving: () => observer !== null
    };
}