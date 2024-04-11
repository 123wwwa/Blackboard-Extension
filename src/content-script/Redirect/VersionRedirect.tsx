/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { pdfToText, summarizePDF } from "../../features/chatgpt";
import { observeUrlChange } from "../../content-script/SPA_Observer/SPA_Observer";
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

const createRandomCmd = () => {
    const random1 = Math.floor(Math.random() * 10);
    const random2 = Math.floor(Math.random() * 2000) + 1000;
    return `_1${random2}_${random1}`;
}
const handleBBVersionRedirect = async (url: string) => {
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    if (settings.isPreviousVersion) {
        if (!url.includes("blackboard.unist.ac.kr/ultra")) {
            return;
        }
        else if (url.includes("blackboard.unist.ac.kr/ultra/institution-page")) {
            window.location.href = "https://blackboard.unist.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";
        }
        else if (url.includes("blackboard.unist.ac.kr/ultra/courses")) {
            let regex = /courses\/(_\d+_\d+)/;
            let match = url.match(regex);
            let courseId = match![1];
            let randomCmd = createRandomCmd();
            let redirectUrl = `https://blackboard.unist.ac.kr/webapps/blackboard/execute/modulepage/view?course_id=${courseId}&cmp_tab_id=${randomCmd}&mode=view`;
            window.location.href = redirectUrl;
        } else {
            //window.location.href = "https://blackboard.unist.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";
        }
    } else {
        if (url.includes("blackboard.unist.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1")) {
            window.location.href = "https://blackboard.unist.ac.kr/ultra/institution-page";
        }
        else if (url.includes("blackboard.unist.ac.kr/webapps/assessment/take/launchAssessment.jsp")) {
            console.log(url);
            const course_id = url.match(/course_id=([^&]+)/);
            const content_id = url.match(/content_id=([^&]+)/);
            if (!course_id || !content_id) {
                return;
            }
            let newUrl = `https://blackboard.unist.ac.kr/ultra/courses/${course_id[1]}/outline/assessment/${content_id[1]}/overview?courseId=${course_id[1]}`;
            window.location.href = newUrl;
        }
        else if (url.includes("webapps/blackboard/execute/modulepage/view?")) {
            const course_id = url.match(/course_id=([^&]+)/);
            let redirectUrl = `https://blackboard.unist.ac.kr/ultra/courses/${course_id![1]}/outline`;
            window.location.href = redirectUrl;
        } else {
            //window.location.href = "https://blackboard.unist.ac.kr/ultra/institution-page";
        }
    }
};

observeUrlChange(async (url) => {
    handleBBVersionRedirect(url);
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    const urlPattern = /https:\/\/blackboard\.unist\.ac\.kr\/ultra\/courses\/(_\d+_\d+)\/outline\/file\/(_\d+_\d+)/;

    if (urlPattern.test(url) && settings.usePreviousViewer) {
        // waitForElm 함수가 프로미스를 반환한다고 가정
        await waitForElm(); // 여기서 await를 사용하여 프로미스가 완료될 때까지 기다립니다.
        const iframe = document.querySelector('iframe[src*="bbcswebdav"]') as HTMLIFrameElement;
        if (!iframe) return; // iframe이 없으면 함수 종료
        let iframeUrl = iframe.src.split("?")[0];
        
        // open in a new tab
        const closeBtn = document.querySelector('button[analytics-id="bb-close.course.content.file"]') as HTMLButtonElement;

        if (closeBtn) closeBtn.click(); // closeBtn이 있으면 클릭 이벤트 발생

        window.open(iframeUrl, '_blank');
    }
});
