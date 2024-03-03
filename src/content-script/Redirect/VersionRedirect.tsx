/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { getChromeStorage } from "../../features/handleChromeStoarge";
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
    if(settings.isPreviousVersion){
        editUrl();
    }
})();
export {}