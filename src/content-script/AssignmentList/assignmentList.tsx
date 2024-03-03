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

(() => {
    let fileInfo: AssignmentList = JSON.parse(localStorage.getItem('fileInfo') || "{}");
    console.log(fileInfo);
    let course_id = new URL(window.location.href).searchParams.get("course_id");
    let filteredFileInfo: AssignmentList = {};
    Object.entries(fileInfo).forEach(([key, value]) => {
        let assignment: Assignment = value;
        if(assignment.course_id == course_id){
            filteredFileInfo[key] = value;
        }
    });

    waitForElm().then(() => {
        
        let AllaTag = document.querySelectorAll("a");
        // get a tag includes href "/webapps/assignment/uploadAssignment"
        let aTags: NodeListOf<HTMLAnchorElement> =document.querySelectorAll('a[href*="/webapps/assignment/uploadAssignment"]');
        if(aTags.length === 0) return;
        for (let i = 0; i < aTags.length; i++) {
            let aTag = aTags[i];
            let content_id = new URL(aTag.href).searchParams.get("content_id");
            Object.entries(filteredFileInfo).forEach(([key, value]) => {
                let assignment: Assignment = value;
                // check if course_id and content_id is same
                console.log(assignment.content_id, content_id);
                if (assignment.content_id == content_id) {
                    appendWatchedSign(aTag);
                }
            });
        }

    
        
    });
})();