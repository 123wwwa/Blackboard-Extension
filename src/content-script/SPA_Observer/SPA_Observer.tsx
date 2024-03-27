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
export const observeElementPresenceOnce = (selector: string, callback: (exists: boolean) => void): void => {
  let hasElementBeenObserved = false; // 요소가 관찰되었는지 추적하는 플래그

  const observerCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
      if (!hasElementBeenObserved) {
          const elementExists = document.querySelector(selector) !== null;
          if (elementExists) {
              callback(elementExists);
              hasElementBeenObserved = true; // 요소가 발견되었으므로 플래그를 true로 설정
              observer.disconnect(); // 더 이상의 변화를 관찰할 필요가 없으므로 관찰자 연결 해제
          }
      }
  };

  const observer = new MutationObserver(observerCallback);

  const config = { childList: true, subtree: true };

  observer.observe(document.body, config);

  // 초기 상태 체크: 문서가 이미 로드된 상태에서 스크립트가 실행될 경우를 대비
  observerCallback([], observer);
};
export const observeUrlChange = (callback: (url: string) => void): void => {
  let previousUrl = window.location.href;

  // 페이지 로드 또는 새로고침 시 현재 URL을 callback으로 전달하여 호출
  window.addEventListener('load', () => {
    previousUrl = window.location.href;
    callback(previousUrl);
  });

  // URL 변경 감지 콜백
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
  observer.observe(document.body, config);
}
