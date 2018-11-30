import { safeUsingDom } from "./safeHTML";

let globalEl = null;

export function confirmNodeList(nodeList, selector) {
    if (!nodeList || !nodeList.length) {
        throw new Error(
            `No elements were found for class ${selector}.`
        );
    }
}

export function initHideWrapper(element) {
    let elementSet = element;
    if (typeof elementSet === "string" && safeUsingDom) {
        const el = document.querySelectorAll(elementSet);
        confirmNodeList(el, elementSet);
        elementSet = "length" in el ? el[0] : el;
    }
    globalEl = elementSet || globalEl;
    return globalEl;
}

export function validateElement(wrapElement) {
    if (!wrapElement && !globalEl) {
        console.warn(
            [
                "App element is not defined.",
                "Please use `Dialog.initHideWrapper(el)` or set `WrapElement={el}`.",
                "This is needed so screen readers don't see main content",
                "when dislog is opened. It is not recommended, but you can opt-out",
                "by setting `ariaHideApp={false}`."
            ].join(" ")
        );

        return false;
    }

    return true;
}

export function hide(wrapElement) {
    if (validateElement(wrapElement)) {
        (wrapElement || globalEl).setAttribute("aria-hidden", "true");
    }
}

export function show(wrapElement) {
    if (validateElement(wrapElement)) {
        (wrapElement || globalEl).removeAttribute("aria-hidden");
    }
}

// export function documentNotReadyOrSSRTesting() {
//     globalEl = null;
// }

// export function resetForTesting() {
//     globalEl = null;
// }
