/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { FileUrl, Assignment, AssignmentList } from "type";
const waitForElm = () => {
    return new Promise(resolve => {
        if (document.getElementById("content_listContainer")) {
            return resolve(document.getElementById("content_listContainer"));
        }

        const observer = new MutationObserver(mutations => {
            if (document.getElementById("content_listContainer")) {
                resolve(document.getElementById("content_listContainer"));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const appendWatchedSign = (aTag: HTMLElement) => {
    let watchedSign = document.createElement("span");
    watchedSign.style.color = "red";
    watchedSign.innerText = "✓";
    if(aTag.parentElement){
        aTag.parentElement.appendChild(watchedSign);
    }
}
window.chrome.storage.sync.get(["fileInfo"], (res) => {
    if(!res.fileInfo){
        return;
    }
    let fileInfo: AssignmentList = JSON.parse(res.fileInfo);

    waitForElm().then(() => {
        
        let AllaTag = document.querySelectorAll("a");
        // get a tag includes href "/webapps/assignment/uploadAssignment"
        for (let i = 0; i < AllaTag.length; i++) {
            let aTag = AllaTag[i];
            if (aTag.href.includes("/webapps/assignment/uploadAssignment")) {
                Object.entries(fileInfo).forEach(([key, value]) => {
                    let assignment: Assignment = value;
                    // check if course_id and content_id is same
                    let course_id = new URL(aTag.href).searchParams.get("course_id");
                    let content_id = new URL(aTag.href).searchParams.get("content_id");
                    if (assignment.course_id == course_id && assignment.content_id == content_id) {
                        appendWatchedSign(aTag);
                    }
                });
            }
        }
    
        
    });

});