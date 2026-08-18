var SASHIMI_ID = "_sashimi";

function buildCSSSelectors(overviewChild, overviewChildSelector) {
    let selectors = ["div#appbar"];
    const inSearchResults = overviewChild.closest("div#search");

    if (inSearchResults) {
        selectors.push(`div:has(> div > ${overviewChildSelector})`);
    } else {
        selectors.push(`div:has(> div > div > div > div > div > div > ${overviewChildSelector})`);
    }

    return selectors;
}

function injectSashimi(cssSelectors) {
    let sashimiStyle = document.getElementById(SASHIMI_ID);
    if (!sashimiStyle) {
        sashimiStyle = document.createElement("style");
        sashimiStyle.id = SASHIMI_ID;
        document.documentElement.appendChild(sashimiStyle);
    }
    sashimiStyle.innerText = cssSelectors.join(",").concat("{ display: none !important; }");
}

var observer = null;

function observeAndInject(overviewChildSelector = "div[data-cb-scope][data-lf-template-root]") {
    observer?.disconnect();

    const sashimiInjected = () => {
        const overviewChild = document.querySelector(overviewChildSelector);
        if (!overviewChild) {
            return false;
        }

        injectSashimi(buildCSSSelectors(overviewChild, overviewChildSelector));

        observer?.disconnect();
        observer = null;

        return true;
    };

    if (sashimiInjected()) {
        return;
    }

    observer = new MutationObserver(sashimiInjected);
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

function uninjectSashimi() {
    observer?.disconnect();
    observer = null;

    document.getElementById(SASHIMI_ID)?.remove();
}

async function updateState() {
    const { on } = await chrome.storage.local.get(["on"]);
    on ? observeAndInject() : uninjectSashimi();
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "on" in changes) {
        updateState();
    }
});

updateState();
