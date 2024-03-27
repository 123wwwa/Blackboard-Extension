/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { observeUrlChange } from "content-script/SPA_Observer/SPA_Observer";

//iife
(async () => {
    observeUrlChange((url) => {

    });
})();
export {};