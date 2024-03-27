/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

var s = document.createElement('script');
s.src = chrome.runtime.getURL('src/content-script/Injector/InterceptMembership/InterceptMembership-append.js');
(document.head || document.documentElement).appendChild(s);