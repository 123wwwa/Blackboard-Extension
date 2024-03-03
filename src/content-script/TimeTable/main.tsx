/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import TimeTable from './Timetable';
import { on } from 'events';

// const body = document.querySelector('body')

// const app = document.createElement('div')

// app.id = 'root'

// // Make sure the element that you want to mount the app to has loaded. You can
// // also use `append` or insert the app using another method:
// // https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
// //
// // Also control when the content script is injected from the manifest.json:
// // https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time
// if (body) {
//   body.prepend(app)
// }
const waitForElm = (selector: string) => {
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
const waitForElmAppearanceAfterRemoval = (selector: string) => {
  return new Promise(resolve => {
    let elementPresent = !!document.querySelector(selector);

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // 요소가 제거되었는지 확인
        if (elementPresent && !document.querySelector(selector)) {
          elementPresent = false;
        }
        // 요소가 다시 추가되었는지 확인
        else if (!elementPresent && document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
          elementPresent = true; // 요소가 다시 나타났으므로 상태 업데이트
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const renderTable = (containerSelector:string) => {
  const container = document.querySelector(containerSelector);
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <TimeTable />
      </React.StrictMode>
    );
  } else {
    console.log('React 컨테이너를 찾을 수 없습니다.');
  }
}
const createRandomCmd = () => {
  const random1 = Math.floor(Math.random() * 10);
  const random2 = Math.floor(Math.random() * 2000) + 1000;
  return `_1${random2}_${random1}`;
}

const editUrl = () => {
  const urlElements = document.querySelectorAll("a[href*='/webapps/blackboard/execute/launcher?type=Course']") as NodeListOf<HTMLAnchorElement>;
  if (urlElements.length === 0) return;
  for (let i = 0; i < urlElements.length; i++) {

    const randomCmd = createRandomCmd();
    const courseIdMatch = urlElements[i].href.match(/id=(_\d+_\d+)/);
    // https://blackboard.unist.ac.kr/webapps/blackboard/execute/modulepage/view?course_id=_10516_1&cmp_tab_id=_12624_3&mode=view
    urlElements[i].href = `https://blackboard.unist.ac.kr/webapps/blackboard/execute/modulepage/view?course_id=${courseIdMatch![1]}&cmp_tab_id=${randomCmd}&mode=view`;
  }

}

const observeElementPresence = (selector: string, callback: (exists: boolean) => void): void => {
  // Observer의 콜백 함수
  const observerCallback: MutationCallback = (mutationsList, observer) => {
    // 페이지 내에서 요소 존재 여부 체크
    const elementExists = document.querySelector(selector) !== null;
    callback(elementExists);
  };

  // MutationObserver 인스턴스 생성
  const observer = new MutationObserver(observerCallback);

  // 관찰할 DOM 변화의 옵션 설정
  const config = { childList: true, subtree: true };

  // 문서의 body에 대한 관찰 시작
  observer.observe(document.body, config);

  // 초기 상태 체크
  observerCallback([], observer);
};
const handleElementPresence = (exists: boolean): void => {
  if (exists) {
    if(document.querySelector("#timeTable")) return;
    renderTable('.module-section');
    // 여기에 요소가 존재할 때 수행할 로직 추가
  }
};

//https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=mygrades&globalNavigation=false
if (window.location.href.includes("https://blackboard.unist.ac.kr/ultra/")) {
  //blackboard ultra

  observeElementPresence('.module-wrapper', handleElementPresence);
} else {
  waitForElm('div[id*="22_1termCourses"]').then(() => {
    const container = document.getElementById('column2') as HTMLElement;
    const root: any = createRoot(container!);
    editUrl();
    root.render(
      <React.StrictMode>
        <TimeTable />
      </React.StrictMode>
    )
  });
}


