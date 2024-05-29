import { setLectureObject, setShapedLectureList } from "~shared/stores/lectureStore";
import { getChromeStorage, setChromeStorage } from "../../shared/storage";
import type { Assignment, AssignmentList, Lecture, ShapedLecture, LectureObject } from "~shared/types/blackboardTypes";
let colorlist: string[] = ["#f2e8e8", "#ffe9e9", "#eff9cc", "#dcf2e9", "#dee8f6", "#fff8cc", "#ffedda", "#dceef2", "#ddd6fe", "#e0e7ff", "#f0abfc", "#7dd3fc"];
export const updateLectureList = async () => { // 강의 리스트를 업데이트
    let storedMemberShip = localStorage.getItem("memberships");
    if (!storedMemberShip) { // 메인 페이지에 접속하여 memberships를 가져오지 못한 경우
        console.error("memberships is empty");
        return;
    }
    storedMemberShip = JSON.parse(storedMemberShip);
    let lectureObject = await convertMemberShip(storedMemberShip);
    lectureObject = await updateFileInfo(lectureObject);
    const shapedLectureList = await convertShapedLectureList(lectureObject);
    setLectureObject(lectureObject);
    setShapedLectureList(shapedLectureList);
    await setChromeStorage("lectureInfo", lectureObject);
};
export const loadLectureList = async () => { // 스토리지에 저장된 강의 리스트를 불러옴
    let lectureObject: LectureObject = await getChromeStorage("lectureInfo", {});
    const shapedLectureList = await convertShapedLectureList(lectureObject);
    lectureObject = await updateFileInfo(lectureObject);
    setLectureObject(lectureObject);
    setShapedLectureList(shapedLectureList);
};

const convertShapedLectureList = (lectureList: LectureObject) => { // 강의 리스트를 시간표로 변환
    let l: ShapedLecture[][] = [[], [], [], [], [], []]; // 0: 월, 1: 화, 2: 수, 3: 목, 4: 금, 5: 토
    let i = 0;
    let key: string;
    // 강의 리스트를 돌면서 강의 시간표를 만듦
    // 강의 시간표는 요일별로 나눠져 있음
    // 강의 시간표는 ShapedLecture 타입으로, 강의 이름, 교수 이름, 시간, 링크, 색상, 시간표 정보를 가짐
    // 이렇게 만들어진 시간표는 시간표를 렌더링하는데 사용됨 (components/timetable.tsx)
    for (key in lectureList) {
        let item: any = lectureList[key];
        i += 1;
        for (let c = 0; c < 3; c++) {
            if (item["timeplace" + c]) {
                let newItem: ShapedLecture = {
                    name: item["name"],
                    professor: item["professor"],
                    time: item["time"],
                    link: item["link"],
                    color: item["color"],
                    timeplace: item["timeplace" + c],
                };
                l[item["timeplace" + c].day].push(newItem);
            }
        }
    }
    return l;
}
const updateFileInfo = async (lectureList: LectureObject) => { // 로컬 스토리지에 저장된 과제 정보를 불러와서 강의 리스트에 추가
    // 로컬 스토리지에 저장된 과제 정보를 불러와서 강의 리스트에 추가
    let assignmentList: AssignmentList = JSON.parse(localStorage.getItem("fileInfo") || "{}");
    //check if fileinfo is empty
    if (Object.keys(assignmentList).length == 0) {
        console.error("fileInfo is empty");
        return lectureList;
    }
    Object.entries(assignmentList).forEach(([key1, value1]) => {
        let course_id: string = key1.split("-")[1];
        Object.entries(lectureList).forEach(([key2, value]) => {
            let lecture: any = value;
            if (lecture.id == course_id) {
                lectureList[key2].assignment.push(value1 as Assignment);
            }
        });
    });
    return lectureList;
}
const convertMemberShip = async (alarmList: any): Promise<LectureObject> => { // 멤버십 정보를 강의 리스트로 변환
    let lectureList: LectureObject = {};
    for (let i = 0; i < alarmList.length; i++) {
        const course = alarmList[i].course;
        let lecture: Lecture = {
            id: course.id,
            name: "",
            engName: course.displayName,
            link: course.externalAccessUrl,
            isLecture: true,
            color: "",
            assignment: [],
            time: "",
            professor: "",
            calendarId: course.courseId,
        };
        const lectureKey = course.displayId.split("_")[1]
        if (course.effectiveAvailability) {
            lectureList[lectureKey] = lecture;
        }
    }
    const response = await fetch(window.chrome.runtime.getURL('assets/lectureInfo.json'));
    const jsonData = await response.json();

    let c = 0;
    for (let key in lectureList) {
        if (jsonData[key] === undefined) {
            lectureList[key].isLecture = false;
        } else {
            c++;
            lectureList[key].name = jsonData[key].name;
            lectureList[key].time = jsonData[key].time;
            lectureList[key].professor = jsonData[key].professor;
            lectureList[key].color = colorlist[c % colorlist.length];
            if (jsonData[key].timeplace0) {
                lectureList[key].timeplace0 = jsonData[key].timeplace0;
            }
            if (jsonData[key].timeplace1) {
                lectureList[key].timeplace1 = jsonData[key].timeplace1;
            }
            if (jsonData[key].timeplace2) {
                lectureList[key].timeplace2 = jsonData[key].timeplace2;
            }
        }
    }

    return lectureList;

}
