var SOJU_ID = "_soju";

function buildCSSSelectors(overviewChild, overviewChildSelector) {
    let selectors = ["div#appbar"];
    selectors.shift();

    const inSearchResults = overviewChild.closest("div#search");

    if (inSearchResults) {
        selectors.push(`div:has(> div > ${overviewChildSelector})`);
    } else {
        selectors.push(`div:has(> div > div > div > div > div > div > ${overviewChildSelector})`);
    }

    return selectors;
}

function injectSoju(cssSelectors) {
    let sojuStyle = document.getElementById(SOJU_ID);
    if (!sojuStyle) {
        sojuStyle = document.createElement("style");
        sojuStyle.id = SOJU_ID;
        document.documentElement.appendChild(sojuStyle);
    }
    sojuStyle.innerText = cssSelectors.join(",").concat("{ display: none !important; }");
}

var observer = null;

function observeAndInject(overviewChildSelector = "div[data-cb-scope][data-lf-template-root]") {
    observer?.disconnect();

    const sojuInjected = () => {
        const overviewChild = document.querySelector(overviewChildSelector);
        if (!overviewChild) {
            return false;
        }

        injectSoju(buildCSSSelectors(overviewChild, overviewChildSelector));

        observer?.disconnect();
        observer = null;

        return true;
    };

    if (sojuInjected()) {
        return;
    }

    observer = new MutationObserver(sojuInjected);
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

function uninjectSoju() {
    observer?.disconnect();
    observer = null;

    document.getElementById(SOJU_ID)?.remove();
}

async function updateState(on) {
    on ? observeAndInject() : uninjectSoju();
}

chrome.runtime.onMessage.addListener((message, sender) => {
    updateState(message.on);
});


async function main() {
    const { on } = await chrome.storage.local.get(["on"]);
    updateState(on);
}

main();
