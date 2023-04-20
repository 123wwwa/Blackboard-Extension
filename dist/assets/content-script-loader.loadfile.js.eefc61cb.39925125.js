(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/loadfile.js.eefc61cb.js")
    );
  })().catch(console.error);

})();
