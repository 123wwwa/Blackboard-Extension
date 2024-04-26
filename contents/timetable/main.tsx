import type { PlasmoCSConfig } from "plasmo"
import React from "react";
import { createRoot } from "react-dom/client";
import TimeTable from "~components/timetable/TimeTable";
import { observeUrlChange, waitForElement } from "~shared/observer"

export const config: PlasmoCSConfig = {
    matches: ["https://blackboard.unist.ac.k/*"],
    run_at: "document_start",
}
const renderTable = (containerSelector: string) => {
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
observeUrlChange(async (url) => {
    if(url.includes("ultra/institution-page")){
        await waitForElement('.module-wrapper');
        if(document.querySelector("#timeTable")) return;
        renderTable('.module-section');
      }
}, document);