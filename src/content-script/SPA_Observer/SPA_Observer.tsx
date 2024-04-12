export const waitForElement = (selector:string) => {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

export const observeUrlChange = (callback: (url: string) => void): void => {
  let previousUrl = window.location.href;
  let isCallbackCalled = false;
  const triggerCallbackIfNotCalled = () => {
    if (!isCallbackCalled) {
      callback(window.location.href);
      isCallbackCalled = true; // Callback이 호출되었음을 표시
    }
  };
  window.addEventListener('load', triggerCallbackIfNotCalled);
  window.addEventListener('DOMContentLoaded', triggerCallbackIfNotCalled);
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.href;
    if (currentUrl !== previousUrl) {
      previousUrl = currentUrl;
      callback(currentUrl);
    }
  });

  const observerCallback = () => {
    const url = window.location.href;
    if (url !== previousUrl) {
      previousUrl = url;
      callback(url);
    }
  };

  // MutationObserver 설정
  const observer = new MutationObserver(observerCallback);
  const config = { childList: true, subtree: true };

  // document.body is now guaranteed to be available
  observer.observe(document.body, config);
}
