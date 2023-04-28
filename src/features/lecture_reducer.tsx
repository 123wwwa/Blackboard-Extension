export { }
/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { createSlice } from "@reduxjs/toolkit";
import { Lecture, ShapedLecture, AssignmentList, Assignment, Todo } from "type";
import { AppDispatch, RootState } from "./store";
interface LectureList {
    [key: string]: Lecture;
}
export interface InitialState {
    lectureSlice: LectureList;
    shapedLectureList: ShapedLecture[][];
    isLectureLoaded: boolean;
    todoList: Todo[];
    deletedTodoList: Todo[];
}
let initialState: InitialState = {
    lectureSlice: {},
    shapedLectureList: [[], [], [], [], []],
    isLectureLoaded: false,
    todoList: [],
    deletedTodoList: []
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
    },
});
export const { setLecutureList, setShapedLectureList, setLectureAssignment, setTodoList, addTodo } = lectureSlice.actions;


const setChromeStorage = (key: string, value: any) => {
    window.chrome.storage.sync.set({ [key]: value }, () => {
    });
}
const getChromeStorage: any = async (key: string) => {
    const data = await window.chrome.storage.sync.get([key]);
    return data[key];
}
export const getLectureList = async (dispatch: AppDispatch) => {
    let lectureInfoStr = await getChromeStorage("lectureInfo");
    let resLecturelist: LectureList = JSON.parse(lectureInfoStr);
    let assignmentListStr = await getChromeStorage("fileInfo");
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

export const reloadTodoList = async (dispatch: AppDispatch) => {
    let todoList: Todo[] = [];
    const fetchUrl = "https://blackboard.unist.ac.kr/webapps/calendar/calendarData/selectedCalendarEvents?start=" + Date.now() + "&end=2147483647000";
    const fetchData = await (await fetch(fetchUrl)).json();
    let resLecturelistStr = await getChromeStorage("lectureInfo");
    let resLecturelist: LectureList = JSON.parse(resLecturelistStr);
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
    dispatch(setTodoList(todoList));
}
export const updateLectureAssignment = (AssignmentData: AssignmentList) => (dispatch: AppDispatch) => {
    dispatch(setLectureAssignment(AssignmentData));
}
export const selectLectureList = (state: RootState) => state.lectureSlice.lectureSlice;
export const selectShapedLectureList = (state: RootState) => state.lectureSlice.shapedLectureList;
export const selectIsLectureLoaded = (state: RootState) => state.lectureSlice.isLectureLoaded;
export const selectTodoList = (state: RootState) => state.lectureSlice.todoList;
export default lectureSlice.reducer;