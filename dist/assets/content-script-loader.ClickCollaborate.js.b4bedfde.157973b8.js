(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/ClickCollaborate.js.b4bedfde.js")
    );
  })().catch(console.error);

})();
