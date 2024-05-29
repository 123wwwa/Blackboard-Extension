
import type { PlasmoCSConfig } from 'plasmo';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DownloadArea from '~components/content/DownloadArea';
import ErrorBoundary from '~shared/ErrorBoundary';
import { waitForElement } from '~shared/observer';
export const config: PlasmoCSConfig = {
    matches: ["https://blackboard.unist.ac.kr/webapps/blackboard/content/listContent.jsp*"],
}

const urlRegex = /^https:\/\/blackboard\.unist\.ac\.kr\/webapps\/blackboard\/content\/listContent\.jsp\?course_id=[\d_]+&content_id=[\d_]+/;

const changeCSS = () => {
    let container = document.querySelector("#pageTitleText") as HTMLElement;
    let container2 = document.querySelector("#pageTitleBar") as HTMLElement;
    let container3 = document.querySelector("#pageTitleDiv") as HTMLElement;
    container.style.display = "flex";
    container.style.alignItems = "center";
    container2.style.display = "flex";
    container2.style.alignItems = "center";
    container3.style.gap = "15px";
}
waitForElement("#pageTitleDiv").then(() => {
    if (!urlRegex.test(window.location.href)) return;
    let allLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href*="/bbcswebdav"]');
    let allLinks2: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href*="/webapps/assignment/uploadAssignment"]');
    if (allLinks.length === 0 && allLinks2.length === 0) return;
    changeCSS();
    const checkIsAllChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const listContainer = document.getElementById("content_listContainer") as HTMLElement;
        let checkedCount = 0;
        for (let i = 0; i < listContainer.children.length; i++) {
            const item = listContainer.children[i] as HTMLElement;
            const checkbox = item.querySelector('.downloadCheckBox') as HTMLInputElement;
            if (checkbox.checked) checkedCount++;
        }
        if (checkedCount === listContainer.children.length) {
            const selectAll = document.querySelector("#selectAll") as HTMLInputElement;
            selectAll.checked = true;
        }
        if (checkedCount == 0) {
            const selectAll = document.querySelector("#selectAll") as HTMLInputElement;
            selectAll.checked = false;
        }
    }
    const listContainer = document.getElementById("content_listContainer") as HTMLElement;
    // loop in listContainer
    for (let i = 0; i < listContainer.children.length; i++) {
        const item = listContainer.children[i] as HTMLElement;
        let links = item.querySelectorAll('a[href*="/bbcswebdav/pid-"]') as NodeListOf<HTMLAnchorElement>;
        //loop in links
        for (let j = 0; j < links.length; j++) {
            const link = links[j];
            const onclickStr = `window.open('${link.href}', '_blank'); return false;`;
            link.setAttribute("onclick", onclickStr);
            //link.setAttribute("href", "javascript:;");
        }
        if (links.length != 0) {
            //remove firstchild
            item?.children[0].remove();
            const div = document.createElement("div");
            div.style.width = "50px";
            div.style.height = "50px";
            div.style.position = "absolute";
            div.style.display = "flex";
            div.style.justifyContent = "center";
            item.prepend(div!);
            const divRoot = createRoot(div!);
            const id = item.id.split(":")[1];
            divRoot.render(
                <React.StrictMode>
                    <input type="checkbox" className='downloadCheckBox' id={"item:" + id} onChange={(e) => checkIsAllChecked(e)} />
                </React.StrictMode>
            )
        }
    }
    const container = document.querySelector("#pageTitleDiv") as HTMLElement;
    //edit style of container to flex
    container.style.display = "flex";
    // append button in container
    const rootEl = document.createElement("div");
    rootEl.id = "root-container";
    container.prepend(rootEl);
    const root: any = createRoot(rootEl!);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <DownloadArea />
            </ErrorBoundary>
        </React.StrictMode>
    )
})