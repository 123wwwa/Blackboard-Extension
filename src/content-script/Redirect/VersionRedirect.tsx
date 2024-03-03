/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { getChromeStorage } from "../../features/handleChromeStoarge";

(async()=>{
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    if(settings.isPreviousVersion){
    }
})();
export {}