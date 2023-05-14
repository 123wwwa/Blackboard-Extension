/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { createSlice } from "@reduxjs/toolkit";
import { Lecture, ShapedLecture, AssignmentList, Assignment, Todo, BB_alarm } from "type";
import { AppDispatch, RootState } from "./store";
import { RawAlarm, convertBB_alarm } from "./rawAlarmHandler";
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
}
let initialState: InitialState = {
    lectureSlice: {},
    shapedLectureList: [[], [], [], [], []],
    isLectureLoaded: false,
    todoList: [],
    deletedTodoList: [],
    bb_alarmList: [],
}

export const lectureSlice = createSlice({
    name: "lectureSlice",
    initialState: initialState,
    reducers: {
        setLecutureList: (state, action) => {
            state.lectureSlice = action.payload;
        },
        setShapedLectureList: (state, action) => {
            state.shapedLectureList = action.payload;
            state.isLectureLoaded = true;
        },
        setLectureAssignment: (state, action) => {
            let assignmentList: AssignmentList = action.payload;
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
            //console.log(state.bb_alarmList);
        }
    },
});
export const { setLecutureList, setShapedLectureList, setLectureAssignment, setTodoList, addTodo, addDeletedTodo, resetDeletedTodo, setBB_alarms } = lectureSlice.actions;


export const setChromeStorage = async (key: string, value: any) => {
    window.chrome.storage.sync.set({ [key]: value });
}
export const getChromeStorage: any = async (key: string, defaultValue: string) => {
    const data = await window.chrome.storage.sync.get([key]);
    //console.log(data);
    if (!data[key]) {
        console.log("no data");
        return defaultValue;
    }
    return data[key];
}
const APIwithcatch = async (url: string, header: string) => {
    try {
        var response = await fetch(url, JSON.parse(header));
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch (e) {
        return null;
    }
}
export const getLectureList = async (dispatch: AppDispatch) => {
    let lectureInfoStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(lectureInfoStr);
    let assignmentListStr = await getChromeStorage("fileInfo", "{}");
    let assignmentList = JSON.parse(assignmentListStr);
    Object.entries(assignmentList).forEach(([key1, value1]) => {
        let course_id: string = key1.split("-")[1];
        Object.entries(resLecturelist).forEach(([key2, value]) => {
            let lecture: any = value;
            if (lecture.id == course_id) {
                resLecturelist[key2].assignment.push(value1 as Assignment);
            }
        })
    })
    dispatch(setLecutureList(resLecturelist));
    let l: ShapedLecture[][] = [[], [], [], [], []];
    let i = 0;
    let key: string;
    for (key in resLecturelist) {
        let item: any = resLecturelist[key];
        i += 1;
        for (let c = 0; c < 3; c++) {
            if (item["timeplace" + c]) {
                let newItem: ShapedLecture = {
                    "name": item["name"],
                    "professor": item["professor"],
                    "time": item["time"],
                    "link": item["link"],
                    "color": item["color"],
                    "timeplace": item["timeplace" + c]
                }
                l[item["timeplace" + c].day].push(newItem);

            }
        }
    }
    dispatch(setShapedLectureList(l));

}
export const getTodoList = async (dispatch: AppDispatch) => {
    let todoListStr = await getChromeStorage("todoList", "[]");
    let todoList: Todo[] = JSON.parse(todoListStr);
    dispatch(setTodoList(todoList));
    //postTodoList(todoList);
}
export const resetTodoList = async (dispatch: AppDispatch) => {
    setChromeStorage("deletedTodoList", "[]");
    dispatch(reloadTodoList);
}
export const reloadTodoList = async (dispatch: AppDispatch) => {
    let todoListStr = await getChromeStorage("todoList", "[]");
    let todoList: Todo[] = JSON.parse(todoListStr);
    // splice todolist if linkcode is exist
    for (let key in todoList) {
        let todo: Todo = todoList[key];
        if (todo.linkcode) {
            todoList.splice(parseInt(key), 1);
        }
    }
    const fetchUrl = "https://blackboard.unist.ac.kr/webapps/calendar/calendarData/selectedCalendarEvents?start=" + Date.now() + "&end=2147483647000";
    const fetchData = await APIwithcatch(fetchUrl, "{}");
    if (!fetchData) {
        dispatch(getTodoList);
        return;
    };
    
    if (fetchData.length == 0) {
        dispatch(getTodoList);
        return;
    };
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
        let letureColor: string = "";
        Object.entries(resLecturelist).forEach(([key2, value]) => {
            let lecture: Lecture = value;
            if (lecture.engName == fetchData[key]["calendarName"]) {
                letureColor = lecture.color;
            }
        })
        let newStartString = fetchData[key]["start"];
        let newDate = new Date(newStartString);
        let assignName = fetchData[key]["title"];
        let link = "";
        if (fetchData[key]["calendarName"] !== "Personal") {
            assignName = fetchData[key]["calendarName"] + ": " + assignName;
            link = fetchData[key]["id"];
        }
        let todo: Todo = {
            course_name: fetchData[key]["calendarName"],
            content: assignName,
            date: newDate.getTime(),
            color: letureColor,
            linkcode: link
        };
        todoList.push(todo);
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
    setChromeStorage("todoList", JSON.stringify(newTodoList));
    dispatch(setTodoList(newTodoList));
    //postTodoList(newTodoList);
}
export const deleteTodo = (dispatch: AppDispatch) => async (todo: Todo) => {
    if (todo.linkcode) { // check if linkcode exist to add only fetched todo
        dispatch(addDeletedTodo(todo));
        let deletedTodoListStr = await getChromeStorage("deletedTodoList", "[]");
        let deletedTodoList: Todo[] = JSON.parse(deletedTodoListStr);
        deletedTodoList.push(todo);
        setChromeStorage("deletedTodoList", JSON.stringify(deletedTodoList));
    }
    let todoListStr = await getChromeStorage("todoList", "[]");
    let todoList: Todo[] = JSON.parse(todoListStr);
    let newTodoList: Todo[] = [];
    //delete todo
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (todo.content == newTodo.content && todo.date == newTodo.date) {
            continue;
        }
        newTodoList.push(newTodo);
    }
    setChromeStorage("todoList", JSON.stringify(newTodoList));
    dispatch(setTodoList(newTodoList));
    //postTodoList(newTodoList);
}
export const addTodoItem = (dispatch: AppDispatch) => async (todo: Todo) => {
    // check if duplicated
    let todoListStr = await getChromeStorage("todoList", "[]");
    let todoList: Todo[] = JSON.parse(todoListStr);
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (todo.content == newTodo.content && todo.date == newTodo.date && todo.linkcode == newTodo.linkcode) {
            return;
        }
    }

    dispatch(addTodo(todo));
    todoList.push(todo);
    setChromeStorage("todoList", JSON.stringify(todoList));
}
export const getBB_alarms = async (dispatch: AppDispatch) => {
    let bb_alarmsStr = await getChromeStorage("BB_alarms", "[]");
    let bb_alarms: BB_alarm[] = JSON.parse(bb_alarmsStr);
    console.log(bb_alarms);
    dispatch(setBB_alarms(bb_alarms));
}
export const reloadBB_alarms = async (dispatch: AppDispatch) => {
    const url = "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer";
    const fetchdata = await fetch(url, {
        "headers": {
          "accept": "text/javascript, text/html, application/xml, text/xml, */*",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-prototype-version": "1.7",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://blackboard.unist.ac.kr/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts&globalNavigation=false",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "cmd=loadStream&streamName=alerts&providers=%7B%7D&forOverview=false",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
    if(!fetchdata.ok) {
        dispatch(getBB_alarms);
        return;
    };
    
    let alarmListStr = await fetchdata.text();
    if(!alarmListStr) {
        dispatch(getBB_alarms);
        return;
    };
    let rawAlarmList = JSON.parse(alarmListStr).sv_streamEntries;
    if(rawAlarmList.length == 0) {
        //dispatch(getBB_alarms);
        //console.log("no alarm");
        return;
    };
    let BB_alarms =  await convertBB_alarm(alarmListStr);
    setChromeStorage("BB_alarms", JSON.stringify(BB_alarms));  
    dispatch(setBB_alarms(BB_alarms));
}
export const postTodoList = async (todoList: Todo[]) => {
    window.chrome.runtime.sendMessage({ action: "updateTodo", todoList: todoList });
}
export const selectLectureList = (state: RootState) => state.lectureSlice.lectureSlice;
export const selectShapedLectureList = (state: RootState) => state.lectureSlice.shapedLectureList;
export const selectIsLectureLoaded = (state: RootState) => state.lectureSlice.isLectureLoaded;
export const selectTodoList = (state: RootState) => state.lectureSlice.todoList;
export const selectBB_alarmList = (state: RootState) => state.lectureSlice.bb_alarmList;
export default lectureSlice.reducer;