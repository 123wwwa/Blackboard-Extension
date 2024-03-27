/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import TimeTable from './Timetable';
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
const streamNames = {
  "Stream": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=stream",
  "Alerts": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts",
  "My Grades": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=mygrades",
  "Calendar": "https://blackboard.unist.ac.kr/webapps/calendar/viewMyBb",
}
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
const observeElementPresence = (selector: string, callback: (exists: boolean) => void): void => {
  const observerCallback: MutationCallback = (mutationsList, observer) => {
    const elementExists = document.querySelector(selector) !== null;
    callback(elementExists);
  };
  const observer = new MutationObserver(observerCallback);

  const config = { childList: true, subtree: true };

  observer.observe(document.body, config);

  observerCallback([], observer);
};
const handleElementPresence = (exists: boolean): void => {
  if (exists) {
    if(document.querySelector("#timeTable")) return;
    renderTable('.module-section');
  }
};

//https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=mygrades&globalNavigation=false
if (window.location.href.includes("https://blackboard.unist.ac.kr/ultra/")) {
  observeElementPresence('.module-wrapper', handleElementPresence);
} else {
  waitForElm('div[id*="22_1termCourses"]').then(() => {
    const container = document.getElementById('column2') as HTMLElement;
    const root: any = createRoot(container!);
    root.render(
      <React.StrictMode>
        <TimeTable />
      </React.StrictMode>
    );
    const paneTabs = document.querySelector('#paneTabs') as HTMLElement;
    // loop in streamNames
    for (const [key, value] of Object.entries(streamNames)) {
      //appendchild at paneTabs
      const li = document.createElement('li');
      const a = document.createElement('a');
      // a inside li
      a.href = value;
      a.innerHTML = key;
      li.appendChild(a);
      paneTabs.appendChild(li);

    }
  });
}


