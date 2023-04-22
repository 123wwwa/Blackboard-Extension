export {}
/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Lecture, ShapedLecture, AssignmentList, Assignment} from "type";
import { AppDispatch, RootState} from "./store";
import { validateHeaderName } from "http";
const colorlist = ["#eff9cc", "#dee8f6", "#ffe9e9", "#ffedda", "#dcf2e9", "#dceef2", "#fff8cc", "#ffe9e9"];
interface LectureList {
    [key: string]: Lecture;
}
export interface InitialState{
    lectureSlice: LectureList;
    shapedLectureList: ShapedLecture[][];
    isLectureLoaded: boolean;
}
let initialState: InitialState = {
    lectureSlice: {},
    shapedLectureList: [[], [], [], [], []],
    isLectureLoaded: false
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
        }
    },
});
export const { setLecutureList, setShapedLectureList, setLectureAssignment } = lectureSlice.actions;


                
export const reloadLectureList =(dispatch:AppDispatch) => {
    window.chrome.storage.sync.get(['lectureInfo'], (res) => {
        if (res.lectureInfo == undefined && res.lectureInfo == null) {
            alert("블랙보드에 접속하여 강좌정보를 가져오세요!(현재 접속중일경우 새로고침(F5))");
        }
        var resLecturelist: LectureList = JSON.parse(res.lectureInfo);
        var assignmentList = JSON.parse(localStorage.getItem("fileInfo")|| "{}")
        Object.entries(assignmentList).forEach(([key1, value1]) => {
            var course_id:string = key1.split("-")[1];
            Object.entries(resLecturelist).forEach(([key2, value]) => {
                var lecture:any = value;
                if (lecture.id == course_id) {
                    resLecturelist[key2].assignment.push(value1 as Assignment);
                }
            })
        })
        console.log(resLecturelist);
        dispatch(setLecutureList(resLecturelist));
        if (!resLecturelist || (Object.keys(resLecturelist).length === 0 && Object.getPrototypeOf(resLecturelist) === Object.prototype)) {
            alert("블랙보드에 접속하여 강좌정보를 가져오세요!(현재 접속중일경우 새로고침(F5))");
        }
        var l: ShapedLecture[][] = [[], [], [], [], []];
        var key: string;
        var i = 0;
        for (key in resLecturelist) {
            var item: any = resLecturelist[key];
            i += 1;
            for (var c = 0; c < 3; c++) {
                if (item["timeplace" + c]) {
                    var newItem: ShapedLecture = {
                        "name": item["name"],
                        "professor": item["professor"],
                        "time": item["time"],
                        "link": item["link"],
                        "color": colorlist[i],
                        "timeplace": item["timeplace" + c]
                    }
                    l[item["timeplace" + c].day].push(newItem);

                }
            }
        }
        dispatch(setShapedLectureList(l));
    })
}
export const updateLectureAssignment = (AssignmentData:AssignmentList)=>(dispatch:AppDispatch) => {
    dispatch(setLectureAssignment(AssignmentData));
}
export const selectLectureList = (state: RootState ) => state.lectureSlice.lectureSlice;
export const selectShapedLectureList = (state: RootState) => state.lectureSlice.shapedLectureList;
export const selectIsLectureLoaded = (state: RootState) => state.lectureSlice.isLectureLoaded;
export default lectureSlice.reducer;