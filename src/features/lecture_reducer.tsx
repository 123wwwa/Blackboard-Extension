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

        addDeletedTodo: (state, action) => {
            state.deletedTodoList.push(action.payload);
        },
        resetDeletedTodo (state) {
            state.deletedTodoList = [];
        }
    },
});
export const { setLecutureList, setShapedLectureList, setLectureAssignment, setTodoList, addTodo ,addDeletedTodo, resetDeletedTodo } = lectureSlice.actions;


const setChromeStorage = (key: string, value: any) => {
    window.chrome.storage.sync.set({ [key]: value }, () => {
    });
}
const getChromeStorage: any = async (key: string, defaultValue: string) => {
    const data = await window.chrome.storage.sync.get([key]);
    if(!data[key]){
        return defaultValue;
    }
    return data[key];
}
const APIwithcatch = async (url:string)=> {
    try{
        var response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }catch(e){
        return null;
    }
  }
export const getLectureList = async (dispatch: AppDispatch) => {
    let lectureInfoStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(lectureInfoStr) ;
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
}
export const resetTodoList = async (dispatch: AppDispatch) => {
    // delete todo only if linkcode is undefined
    // let todoListStr = await getChromeStorage("todoList", "[]");
    // let todoList: Todo[] = JSON.parse(todoListStr);
    // let newTodoList: Todo[] = [];
    // for (let key in todoList) {
    //     let todo: Todo = todoList[key];
    //     console.log(todo.linkcode);
    //     if (!todo.linkcode) {
    //         newTodoList.push(todo);
    //     }
    // }
    // dispatch(setTodoList(newTodoList));
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
    const fetchData = await APIwithcatch(fetchUrl);
    if(!fetchData)  {
        dispatch(getTodoList);
        return;
    };
    if(fetchData.length == 0) {
        dispatch(getTodoList);
        return;
    };
    let resLecturelistStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(resLecturelistStr);
    // remove deleted todo
    let deletedTodoListStr = await getChromeStorage("deletedTodoList",[]);
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
}
export const deleteTodo = (dispatch: AppDispatch) => async (todo: Todo) => {
    if(todo.linkcode){ // check if linkcode exist to add only fetched todo
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
    console.log(newTodoList);
    setChromeStorage("todoList", JSON.stringify(newTodoList));
    dispatch(setTodoList(newTodoList));
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


export const selectLectureList = (state: RootState) => state.lectureSlice.lectureSlice;
export const selectShapedLectureList = (state: RootState) => state.lectureSlice.shapedLectureList;
export const selectIsLectureLoaded = (state: RootState) => state.lectureSlice.isLectureLoaded;
export const selectTodoList = (state: RootState) => state.lectureSlice.todoList;
export default lectureSlice.reducer;