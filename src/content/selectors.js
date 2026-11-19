/**
 * @file src/content/selectors.js
 * 
 * Selection constants + CSS build util(s)
 */

export const OVERVIEW_CHILD_SELECTOR = "div[data-cb-scope][data-lf-template-root]";
export const SIDE_PANEL_SELECTOR = "div#appbar + div + div";
export const SEARCH_RESULTS_SELECTOR = "div#search";

export function buildSelectors(
    overviewChild,
    childSelector = OVERVIEW_CHILD_SELECTOR
) {
    const selectors = [SIDE_PANEL_SELECTOR];

    if (overviewChild.closest(SEARCH_RESULTS_SELECTOR)) {
        selectors.push(`div:has(> div > ${childSelector})`);
    } else {
        selectors.push(`div:has(> div > div > div > div > ${childSelector})`);
    }

    return selectors;
}

export function buildCSS(selectors) {
    return selectors.join(",").concat(`{ display: none !important; }`)
}
