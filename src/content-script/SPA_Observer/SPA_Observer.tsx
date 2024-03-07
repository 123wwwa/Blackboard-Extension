export const observeElementPresence = (selector: string, callback: (exists: boolean) => void): void => {
    const observerCallback: MutationCallback = (mutationsList, observer) => {
      const elementExists = document.querySelector(selector) !== null;
      callback(elementExists);
    };
    const observer = new MutationObserver(observerCallback);
  
    const config = { childList: true, subtree: true };
  
    observer.observe(document.body, config);
  
    observerCallback([], observer);
};