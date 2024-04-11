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

  // 페이지 로드 또는 새로고침 시 현재 URL을 callback으로 전달하여 호출
  // window.addEventListener('DOMContentLoaded', () => {
  //   previousUrl = window.location.href;
  //   callback(previousUrl);
  // });
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
