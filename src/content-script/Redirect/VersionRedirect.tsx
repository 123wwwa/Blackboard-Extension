/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { getChromeStorage } from "../../features/handleChromeStoarge";
const waitForElm = () => {
    return new Promise(resolve => {
        if (document.querySelector('iframe[src*="bbcswebdav"]')) {
            return resolve(document.querySelector('iframe[src*="bbcswebdav"]'));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector('iframe[src*="bbcswebdav"]')) {
                resolve(document.querySelector('iframe[src*="bbcswebdav"]'));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const editUrl = () => {
    let url = window.location.href;
    // check if blackboard ultra
    if (!url.includes("blackboard.unist.ac.kr/ultra")) {
      return;
    }
    if(url.includes("blackboard.unist.ac.kr/ultra/institution-page")) {
        window.location.href = "https://blackboard.unist.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";
    }
    if(url.includes("blackboard.unist.ac.kr/ultra/courses")) {
        let regex = /courses\/(_\d+_\d+)/;
        let match = url.match(regex);
        let courseId = match![1];   
        let randomCmd = createRandomCmd();
        let redirectUrl = `https://blackboard.unist.ac.kr/webapps/blackboard/execute/modulepage/view?course_id=${courseId}&cmp_tab_id=${randomCmd}&mode=view`;
        window.location.href = redirectUrl;
    }
}
const createRandomCmd = () => {
    const random1 = Math.floor(Math.random() * 10);
    const random2 = Math.floor(Math.random() * 2000) + 1000;
    return `_1${random2}_${random1}`;
  }
(async()=>{
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    let url = window.location.href;
    // todo handle SPA
    if(settings.isPreviousVersion){
        editUrl();
    }else{
        if(url.includes("blackboard.unist.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1")){
            window.location.href = "https://blackboard.unist.ac.kr/ultra/institution-page";
        }
    }
    
    const urlPattern = /https:\/\/blackboard\.unist\.ac\.kr\/ultra\/courses\/(_\d+_\d+)\/outline\/file\/(_\d+_\d+)/;
    if(urlPattern.test(url)){
        console.log("matched");
        // wait for the iframe to load
        // mutation observer
        waitForElm().then(() => {
            const iframe = document.querySelector('iframe[src*="bbcswebdav"]') as HTMLIFrameElement;
            let iframeUrl = iframe.src;
            iframeUrl = iframeUrl.split("?")[0]
            // open in a new tab
            const closeBtn = document.querySelector('button[analytics-id="bb-close.course.content.file"]') as HTMLButtonElement;
            //closeBtn.click();
            //window.open(iframeUrl, '_blank');
        }
        );
    }
})();
export {}