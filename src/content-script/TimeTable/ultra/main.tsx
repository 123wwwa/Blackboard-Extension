/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import TimeTable from '../Timetable';
import { observeUrlChange, waitForElement } from '../../../content-script/SPA_Observer/SPA_Observer';
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

//https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=mygrades&globalNavigation=false
observeUrlChange(async (url) => {
  if(url.includes("ultra/institution-page")){
    await waitForElement('.module-wrapper');
    if(document.querySelector("#timeTable")) return;
    renderTable('.module-section');
  }
});


