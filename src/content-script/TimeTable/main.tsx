/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import TimeTable from './Timetable';
import { waitForElement } from '../SPA_Observer/SPA_Observer';

const streamNames = {
    "Stream": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=stream",
    "Alerts": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts",
    "My Grades": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=mygrades",
    "Calendar": "https://blackboard.unist.ac.kr/webapps/calendar/viewMyBb",
  }
waitForElement('div[id*="22_1termCourses"]').then(() => {
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