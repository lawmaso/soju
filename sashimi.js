function inject(overviewHook = "div[data-cb-scope][data-lf-template-root]") {
    const partialOverview = document.querySelector(overviewHook);
    if (!partialOverview) {
        return
    }

    let cssSelectors = ["div.appbar"];
    const inSearchResults = partialOverview.closest("div#search");

    if (inSearchResults) {
        cssSelectors.push(`div:has(> div > ${overviewHook})`);
    } else {
        cssSelectors.push(`div:has(> div > div > div > div > div > div > ${overviewHook})`);
    }

    const style = document.createElement("style"); style.id = "sashimi";
    style.innerHTML = cssSelectors.join(",").concat("{ display: none !important; }");
    document.documentElement.appendChild(style);
}

function uninject() {
    const style = document.getElementById("sashimi");
    if (!style) {
        return
    }

    document.documentElement.removeChild(style);
}

async function main() {
    const { on } = await chrome.storage.local.get(["on"]);
    on ? inject() : uninject();
}

main();
