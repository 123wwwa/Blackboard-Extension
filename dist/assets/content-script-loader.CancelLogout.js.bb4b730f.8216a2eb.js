(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/CancelLogout.js.bb4b730f.js")
    );
  })().catch(console.error);

})();
