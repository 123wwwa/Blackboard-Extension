/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { createSlice } from "@reduxjs/toolkit";
import { Lecture, ShapedLecture, AssignmentList, Assignment, Todo, BB_alarm, AlignWith, FileUrl } from "type";
import { AppDispatch, RootState } from "./store";
import { RawAlarm, convertBB_alarm } from "./rawAlarmHandler";
import { getChromeStorage, setChromeStorage, APIwithcatch, setChromeStorageList, getChromeStorageList } from "./handleChromeStoarge";
import { get } from "https";
interface LectureList {
    [key: string]: Lecture;
}
export interface InitialState {
    lectureSlice: LectureList;
    shapedLectureList: ShapedLecture[][];
    isLectureLoaded: boolean;
    todoList: Todo[];
    deletedTodoList: Todo[];
    bb_alarmList: BB_alarm[];
    alignWith: AlignWith;
    checkedFiles: FileUrl[];
}
let initialState: InitialState = {
    lectureSlice: {},
    shapedLectureList: [[], [], [], [], [], []],
    isLectureLoaded: false,
    todoList: [],
    deletedTodoList: [],
    bb_alarmList: [],
    alignWith: "date",
    checkedFiles: [],
};
let colorlist: string[] = ["#f2e8e8", "#ffe9e9", "#eff9cc", "#dcf2e9", "#dee8f6", "#fff8cc", "#ffedda", "#dceef2", "#ddd6fe", "#e0e7ff", "#f0abfc", "#7dd3fc"];
export const lectureSlice = createSlice({
    name: "lectureSlice",
    initialState: initialState,
    reducers: {
        setLectureList: (state, action) => {
            state.lectureSlice = action.payload;
        },
        setShapedLectureList: (state, action) => {
            state.shapedLectureList = action.payload;
            state.isLectureLoaded = true;
        },
        setLectureAssignment: (state, action) => {
            let lecture = state.lectureSlice[action.payload.lectureID];
        },
        setTodoList: (state, action) => {
            state.todoList = action.payload;
        },
        addTodo: (state, action) => {
            state.todoList.push(action.payload);
        },
        addDeletedTodo: (state, action) => {
            state.deletedTodoList.push(action.payload);
        },
        resetDeletedTodo(state) {
            state.deletedTodoList = [];
        },
        setBB_alarms: (state, action) => {
            state.bb_alarmList = action.payload;
        },
        setAlignWith: (state, action) => {
            state.alignWith = action.payload;
        },
        addCheckedFile: (state, action) => {
            if (state.checkedFiles.find((file) => file.fileURL == action.payload.fileURL) == undefined) {
                // check if file is already checked
                state.checkedFiles.push(action.payload);
            }
        },
        removeCheckedFile: (state, action) => {
            state.checkedFiles = state.checkedFiles.filter((file) => file.fileURL != action.payload.fileURL);
        },
        setCheckedFiles: (state, action) => {
            state.checkedFiles = action.payload;
        },
        deleteSelectedFiles: (state) => {
            // delete files inside lectureList.assignment
            state.checkedFiles.forEach((file) => {
                Object.entries(state.lectureSlice).forEach(([key, value]) => {
                    let assignments = value.assignment;
                    assignments.forEach((assignment, index) => {
                        state.lectureSlice[key].assignment[index].Assignment_Files = assignment.Assignment_Files.filter(
                            (fileUrl) => fileUrl.fileURL != file.fileURL
                        );
                        state.lectureSlice[key].assignment[index].fileUrl = assignment.fileUrl.filter(
                            (fileUrl) => fileUrl.fileURL != file.fileURL
                        );
                    });
                });
            });
        },
    },
});
export const {
    setLectureList,
    setShapedLectureList,
    setLectureAssignment,
    setTodoList,
    addTodo,
    addDeletedTodo,
    resetDeletedTodo,
    setBB_alarms,
    setAlignWith,
    addCheckedFile,
    setCheckedFiles,
    removeCheckedFile,
    deleteSelectedFiles,
} = lectureSlice.actions;
export const getMemberShip = async (dispatch: AppDispatch) => {
    let storedMemberShip = localStorage.getItem("memberships");
    if (!storedMemberShip) {
        storedMemberShip = await getChromeStorage("lectureInfo", "[]");
        return;
    }
    storedMemberShip = JSON.parse(storedMemberShip);
    let lectureList = await convertMemberShip(storedMemberShip);
    lectureList = await updateFileInfo(lectureList);
    dispatch(setLectureList(lectureList));
    getShapedLectureList(dispatch, lectureList);
    setChromeStorage("lectureInfo", JSON.stringify(lectureList));
};
function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};
const convertMemberShip = async (alarmList: any): Promise<LectureList> => {
    let lectureList: LectureList = {};
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
    const response = await fetch(window.chrome.runtime.getURL('public/assets/lectureInfo.json'));
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
const getShapedLectureList = (dispatch: AppDispatch, lectureList: LectureList) => {
    let l: ShapedLecture[][] = [[], [], [], [], [], []];
    let i = 0;
    let key: string;
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
    dispatch(setShapedLectureList(l));
}
const updateFileInfo = async (lectureList: LectureList) => {
    let assignmentList: AssignmentList = JSON.parse(localStorage.getItem("fileInfo") || "{}");
    //check if fileinfo is empty
    if (Object.keys(assignmentList).length == 0) {
        console.error("fileInfo is empty");
        return lectureList;
    } else {
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
}
export const getLectureList = async (dispatch: AppDispatch) => {
    let lectureInfoStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(lectureInfoStr);
    resLecturelist = await updateFileInfo(resLecturelist);
    dispatch(setLectureList(resLecturelist));
    getShapedLectureList(dispatch, resLecturelist);
};
export const getTodoList = async (dispatch: AppDispatch) => {
    let todoList: Todo[] = await getChromeStorageList("todoList");

    dispatch(setTodoList(todoList));
    //postTodoList(todoList);
};
export const resetTodoList = async (dispatch: AppDispatch) => {
    setChromeStorage("deletedTodoList", "[]");
    dispatch(reloadTodoList);
};
export const reloadTodoList = async (dispatch: AppDispatch) => {
    let todoList: Todo[] = await getChromeStorageList("todoList");
    // splice todolist if linkcode is exist
    for (let key in todoList) {
        let todo: Todo = todoList[key];
        if (todo.linkcode) {
            todoList.splice(parseInt(key), 1);
        }
    }
    const fetchUrl =
        "https://blackboard.unist.ac.kr/webapps/calendar/calendarData/selectedCalendarEvents?start=" +
        Date.now() +
        "&end=2147483647000";
    const fetchData = await APIwithcatch(fetchUrl, "{}");
    if (!fetchData) {
        dispatch(getTodoList);
        return;
    }

    if (fetchData.length == 0) {
        dispatch(getTodoList);
        return;
    }
    let resLecturelistStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(resLecturelistStr);
    // remove deleted todo
    let deletedTodoListStr = await getChromeStorage("deletedTodoList", "[]");
    let deletedTodoList: Todo[] = JSON.parse(deletedTodoListStr);
    for (let key in deletedTodoList) {
        let deletedTodo: Todo = deletedTodoList[key];
        for (let key2 in fetchData) {
            if (deletedTodo.linkcode == fetchData[key2]["id"]) {
                fetchData.splice(parseInt(key2), 1);
            }
        }
    }
    for (let key in fetchData) {
        if (fetchData[key]["calendarName"] == "Personal" || fetchData[key]["calendarName"].includes("ULP")) {
            continue;
        }
        let lectureColor: string = "";
        let korLectureName: string = "";
        Object.entries(resLecturelist).forEach(([key2, value]) => {
            let lecture: Lecture = value;
            if (lecture.calendarId == fetchData[key]["calendarId"]) {
                lectureColor = lecture.color;
                korLectureName = lecture.name;
            }
        });
        let newStartString = fetchData[key]["start"];
        let newDate = new Date(newStartString);
        let assignName = fetchData[key]["title"];
        let link = "";
        if (fetchData[key]["calendarName"] !== "Personal") {
            assignName = korLectureName + ": " + assignName;
            link = fetchData[key]["id"];
        }
        let todo: Todo = {
            course_name: fetchData[key]["calendarName"],
            content: assignName,
            date: newDate.getTime(),
            color: lectureColor,
            linkcode: link,
        };
        if (todo.color != "") {
            todoList.push(todo);
        }
    }
    // remove duplicated todo
    let newTodoList: Todo[] = [];
    for (let key in todoList) {
        let todo: Todo = todoList[key];
        let isDuplicated = false;
        for (let key2 in newTodoList) {
            let newTodo: Todo = newTodoList[key2];
            if (todo.content == newTodo.content && todo.date == newTodo.date && todo.linkcode == newTodo.linkcode) {
                isDuplicated = true;
            }
        }
        if (!isDuplicated) {
            newTodoList.push(todo);
        }
    }
    setChromeStorageList("todoList", newTodoList);
    dispatch(setTodoList(newTodoList));
    //postTodoList(newTodoList);
};
export const deleteTodo = (dispatch: AppDispatch) => async (todo: Todo) => {
    if (todo.linkcode) {
        // check if linkcode exist to add only fetched todo
        dispatch(addDeletedTodo(todo));
        let deletedTodoListStr = await getChromeStorage("deletedTodoList", "[]");
        let deletedTodoList: Todo[] = JSON.parse(deletedTodoListStr);
        deletedTodoList.push(todo);
        setChromeStorage("deletedTodoList", JSON.stringify(deletedTodoList));
    }
    let todoList: Todo[] = await getChromeStorageList("todoList");
    let newTodoList: Todo[] = [];
    //delete todo
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (todo.content == newTodo.content && todo.date == newTodo.date) {
            continue;
        }
        newTodoList.push(newTodo);
    }
    setChromeStorageList("todoList", newTodoList);
    //setChromeStorage("todoList", JSON.stringify(newTodoList));
    dispatch(setTodoList(newTodoList));
    //postTodoList(newTodoList);
};
export const addTodoItem = (dispatch: AppDispatch) => async (todo: Todo) => {
    // check if duplicated
    let todoList: Todo[] = await getChromeStorageList("todoList");
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (todo.content == newTodo.content && todo.date == newTodo.date && todo.linkcode == newTodo.linkcode) {
            return;
        }
    }

    dispatch(addTodo(todo));
    todoList.push(todo);
    setChromeStorageList("todoList", todoList);
};
export const reloadBB_alarms = async (dispatch: AppDispatch) => {
    // check if last fetch is within 5 minutes
    let lastAlarmFetch = await getChromeStorage("lastAlarmFetch", "0");
    if (Date.now() - parseInt(lastAlarmFetch) < 300000) {
        return;
    }
    const url = "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer";
    const fetchdata = await fetch(url, {
        headers: {
            accept: "text/javascript, text/html, application/xml, text/xml, */*",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-prototype-version": "1.7",
            "x-requested-with": "XMLHttpRequest",
        },
        referrer:
            "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts&globalNavigation=false",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "cmd=loadStream&streamName=alerts&providers=%7B%7D&forOverview=false",
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    if (!fetchdata.ok) {
        return;
    }

    let alarmListStr = await fetchdata.text();
    if (!alarmListStr) {
        return;
    }
    let rawAlarmList = JSON.parse(alarmListStr).sv_streamEntries;
    if (rawAlarmList.length === 0) {
        console.log("failed to fetch alarm");
        let BB_alarms = await getChromeStorage("BB_alarms", "[]");
        dispatch(setBB_alarms(JSON.parse(BB_alarms)));
        return;
    }
    let BB_alarms = await convertBB_alarm(alarmListStr);
    dispatch(setBB_alarms(BB_alarms));
    await setChromeStorage("BB_alarms", JSON.stringify(BB_alarms));
    await setChromeStorage("lastAlarmFetch", Date.now().toString());

};
export const postTodoList = async (todoList: Todo[]) => {
    window.chrome.runtime.sendMessage({ action: "updateTodo", todoList: todoList });
};
export const selectLectureList = (state: RootState) => state.lectureSlice.lectureSlice;
export const selectShapedLectureList = (state: RootState) => state.lectureSlice.shapedLectureList;
export const selectIsLectureLoaded = (state: RootState) => state.lectureSlice.isLectureLoaded;
export const selectTodoList = (state: RootState) => state.lectureSlice.todoList;
export const selectBB_alarmList = (state: RootState) => state.lectureSlice.bb_alarmList;
export const selectAlignWith = (state: RootState) => state.lectureSlice.alignWith;
export const selectCheckedFiles = (state: RootState) => state.lectureSlice.checkedFiles;
export default lectureSlice.reducer;
