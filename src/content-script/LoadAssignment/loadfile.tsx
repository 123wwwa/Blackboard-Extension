/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
var s = document.createElement('script');
s.src = s.src = window.chrome.runtime.getURL('src/content-script/LoadAssignment/loadfile-append.js');
(document.head || document.documentElement).appendChild(s);

//get data from broadcast channel
new BroadcastChannel('fileInfo').onmessage = function (ev) {
    //ev.data is stringified JSON
    //storeData("fileInfo", JSON.parse(ev.data));
    //window.chrome.storage.sync.set({ 'fileInfo': ev.data });
}
export default {}