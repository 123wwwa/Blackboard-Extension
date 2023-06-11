/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '../../features/store';
import DownloadButton from './DownloadButton';


const urlRegex = /^https:\/\/blackboard\.unist\.ac\.kr\/webapps\/blackboard\/content\/listContent\.jsp\?course_id=[\d_]+&content_id=[\d_]+/;


const waitForElm = () => {
    return new Promise((resolve) => {
        if (document.querySelector("#pageTitleDiv")) {
            return resolve(document.querySelector("#pageTitleDiv"));
        }
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector("#pageTitleDiv")) {
                resolve(document.querySelector("#pageTitleDiv"));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};
  
waitForElm().then(() => {
    if(!urlRegex.test(window.location.href)) return;
    let allLinks: NodeListOf<HTMLAnchorElement> =document.querySelectorAll('a[href*="/bbcswebdav"]');
    if(allLinks.length === 0) return;  
    const container =  document.querySelector("#pageTitleDiv") as HTMLElement;
    //edit style of container to flex
    container.style.display = "flex";
    // append button in container
    const rootEl = document.createElement("div");
    rootEl.id = "root-container";
    container.prepend(rootEl);
    const root: any = createRoot(rootEl!);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <DownloadButton />
            </Provider>
        </React.StrictMode>
    )
})