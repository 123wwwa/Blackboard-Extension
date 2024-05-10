import type { PlasmoCSConfig } from "plasmo";
import React from "react";
import { createRoot } from "react-dom/client";
import PdfGptContainer from "~components/pdfGpt/PdfGptContainer";
import { pdfToPageText } from "~features/events/pdfExtractor";
import ErrorBoundary from "~shared/ErrorBoundary";
import { observeUrlChange, waitForElement } from "~shared/observer";

export const config: PlasmoCSConfig = {
    matches: ["https://blackboard.unist.ac.kr/*"],
}
observeUrlChange(async (url) => {
    const urlPattern = /https:\/\/blackboard\.unist\.ac\.kr\/ultra\/courses\/(_\d+_\d+)\/outline\/file\/(_\d+_\d+)/;
    if (urlPattern.test(url)) {
        await waitForElement('iframe[src*="bbcswebdav"]');
        // edit styles

        const rootElement = document.createElement("div");
        const target = document.querySelector("#content-tab-panel-content") as HTMLElement;
        target.style.display = "flex";
        target.style.flexDirection = "row";
        const rootContainer = document.querySelector('div[data-base-state-name*="base."]') as HTMLElement;
        rootContainer.style.maxWidth = "100%";
        const closeBtn = document.querySelector('button[analytics-id="bb-close.course.content.file"]') as HTMLElement;
        closeBtn.style.marginLeft = "20px";
        const pdfContainer = document.querySelector(".panel-content-inner") as HTMLElement;
        pdfContainer.style.marginTop = "0px";
        const pageTitle = document.querySelector(".panel-title.secondary-title.student") as HTMLElement;
        const pageTitleText = pageTitle.innerText.trim();
        document.title = pageTitleText;
        const pageTitleContainer = document.querySelector(".panel-title-texteditor") as HTMLElement;
        pageTitleContainer.remove();
        const pageHeader = document.querySelector('div[class^="panel-header"]') as HTMLElement;
        pageHeader.style.height = 'auto';
        const navigatorContainer = document.querySelector('.content-navigator-content-display') as HTMLElement;
        if (navigatorContainer) navigatorContainer.remove();
        const iframe = document.querySelector('iframe[src*="bbcswebdav"]') as HTMLIFrameElement;
        if (!iframe) return;
        let iframeUrl = iframe.src.split("?")[0];
        target.prepend(rootElement);
        const itemRoot = createRoot(rootElement!);
        itemRoot.render(
            <React.StrictMode>
                <ErrorBoundary>
                    <PdfGptContainer pdfUrl={iframeUrl} pdfTitle={pageTitleText} />
                </ErrorBoundary>
            </React.StrictMode>
        )
    }
}, document);