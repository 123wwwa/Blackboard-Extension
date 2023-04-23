/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import logo from './logo.svg'
import { Lecture, LectureList } from '../../type';
const waitForElm = () => {
    return new Promise(resolve => {
        if (document.querySelector('div[id*="22_1termCourses"]')) {
            return resolve(document.querySelector('div[id*="22_1termCourses"]'));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector('div[id*="22_1termCourses"]')) {
                resolve(document.querySelector('div[id*="22_1termCourses"]'));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const getLectureElement = () =>{
    var AllaTag = document.getElementsByTagName('a');
    var lectureDiv = document.querySelector('ul[class*="portletList-img courseListing coursefakeclass"]')
    var lecturelist:LectureList = {};
    for (var i = 0; i < AllaTag.length; i += 1) {
        const item = AllaTag[i] as HTMLElement;
        const itemparent = item.parentElement as HTMLElement;
        const itemparentparent = itemparent.parentElement as HTMLElement;
        if (AllaTag[i].href.includes('/webapps/blackboard/execute/launcher') && !AllaTag[i].className.includes('button') &&  itemparentparent == lectureDiv) {
              const urlObj: any= new URL(AllaTag[i].href);
            var lecture:Lecture = {
                name: AllaTag[i].text, 
                link: AllaTag[i].href, 
                id: urlObj.searchParams.get('id'),
                assignment: [],
                time : "",
                professor: "",
            };
            // temp["name"] = AllaTag[i].text;
            // temp["link"] = AllaTag[i].href;
            // temp["id"] = (new URL(temp["link"])).searchParams.get('id')
            lecturelist[AllaTag[i].text.split(":")[0].split("_")[1]] = lecture;
        }
    }
    // var assignmentList= JSON.parse(localStorage.getItem("fileInfo") || "{}");
    // for (var key in assignmentList) {
    //     var assignment = assignmentList[key];
    //     for(var key2 in lecturelist) {
    //         var item2 = lecturelist[key2];
    //         if (item2["id"] == assignment["id"]) {
    //             lecturelist[key2]["assignment"].push(assignment);
    //         }
    //     }
    // }
    
    fetch(window.chrome.runtime.getURL('public/assets/lectureInfo.json'))
        .then((resp) => resp.json())
        .then(function(jsonData) {
            for (var key in lecturelist) {
                if (jsonData[key] == undefined) {
                    delete lecturelist[key];
                } else {
                    lecturelist[key]["name"] = jsonData[key]["name"]
                    lecturelist[key]["time"] = jsonData[key]["time"]
                    lecturelist[key]["professor"] = jsonData[key]["professor"]
                    if (jsonData[key]["timeplace0"]) {
                        lecturelist[key]["timeplace0"] = jsonData[key]["timeplace0"]
                    }
                    if (jsonData[key]["timeplace1"]) {
                        lecturelist[key]["timeplace1"] = jsonData[key]["timeplace1"]
                    }
                    if (jsonData[key]["timeplace2"]) {
                        lecturelist[key]["timeplace2"] = jsonData[key]["timeplace2"]
                    }
                }
            }
            window.chrome.storage.sync.set({ 'lectureInfo': JSON.stringify(lecturelist) }, () =>{});
        });
}
waitForElm().then((elm) => {
    window.chrome.storage.sync.get(['lectureInfo'], function(res) {
        getLectureElement();
    });
});
export {}