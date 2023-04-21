/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { createSlice } from "@reduxjs/toolkit";
import { Lecture, ShapedLecture } from "type";
const colorlist = ["#eff9cc", "#dee8f6", "#ffe9e9", "#ffedda", "#dcf2e9", "#dceef2", "#fff8cc", "#ffe9e9"];
interface LectureList {
    [key: string]: Lecture;
}
interface InitialState{
    lectureSlice: LectureList;
    shapedLectureList: ShapedLecture[][];
}
let initialState: InitialState = {
    lectureSlice: {},
    shapedLectureList: [[], [], [], [], []]
}
export const lectureSlice = createSlice({
    name: "lectureSlice",
    initialState: initialState,
    reducers: {
        reloadLectureList: (state, action) => {
            window.chrome.storage.sync.get(['lectureInfo'], (res) => {
                if (res.lectureInfo == undefined && res.lectureInfo == null) {
                    alert("블랙보드에 접속하여 강좌정보를 가져오세요!(현재 접속중일경우 새로고침(F5))");
                }
                var resLecturelist: LectureList = JSON.parse(res.lectureInfo);
                state.lectureSlice = resLecturelist;
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
                state.shapedLectureList = l;
            })
        },

    },
});
export const { reloadLectureList } = lectureSlice.actions;
export default lectureSlice.reducer;