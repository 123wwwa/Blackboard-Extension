/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { BB_alarm, Lecture, LectureList } from "type";
import { eventTypeList } from "./eventType";
import { getChromeStorage } from "./handleChromeStoarge";

export interface RawAlarm {
    se_id: string
    se_userId: any
    se_context: string
    se_details: string
    se_bottomContext: string
    se_timestamp: number
    se_courseId: string
    se_participated: boolean
    se_itemUri: string
    se_filterName: string
    extraAttribs: ExtraAttribs
    providerId: string
}
export interface ExtraAttribs {
    event_type: string
}
let EventTypeTextList: { [key: string]: string } = {};
const switchEventType = (eventType: string) => {
    // get corresponding displaytext from eventTypeList
    if (EventTypeTextList[eventType]) return EventTypeTextList[eventType];
    const displayText = eventTypeList.filter((event) => event.value === eventType)[0].displayText;
    EventTypeTextList[eventType] = displayText;
    return displayText;
}
const getTitle = (rawHtml: any, eventType: string) => {
    if (eventType === "AN:AN_AVAIL") {
        const eventTitleRegex = /<span class = 'announcementTitle'>(.*?)</;
        const match = eventTitleRegex.exec(rawHtml);
        if (match) {
            return match[1];
        }
    } else {
        const eventTitleRegex = /<span class='eventTitle'>(.*?)</;
        const match = eventTitleRegex.exec(rawHtml);
        if (match) {
            return match[1]; 
        }
    }
    return "";
}
const course_idToName = (course_id: string, lecturelist:LectureList) => {
    let lecture_name = "";
    Object.entries(lecturelist).forEach(([key, value]) => {
        let lecture: Lecture = value;
        if (lecture.id == course_id) {
            lecture_name = lecture.name;
            return lecture_name;
        }
    })
    return lecture_name;
}
const courseidToColor = (course_id: string, lecturelist: LectureList) => {
    let color = "";
    Object.entries(lecturelist).forEach(([key, value]) => {
        let lecture: Lecture = value;
        if (lecture.id == course_id) {
            color = lecture.color;
            return lecture.color;
        }
    })
    return color;
}
export const convertBB_alarm = async(rawData: string) => {
    const json = JSON.parse(rawData);
    const rawBB_alarmList: RawAlarm[] = json.sv_streamEntries;
    let lectureInfoStr = await getChromeStorage("lectureInfo", "{}");
    let resLecturelist: LectureList = JSON.parse(lectureInfoStr);
    let BB_alarmList: BB_alarm[] = [];
    rawBB_alarmList.forEach((rawAlarm: RawAlarm) => {
        let course_name = course_idToName(rawAlarm.se_courseId, resLecturelist);
        let color = courseidToColor(rawAlarm.se_courseId, resLecturelist);
        const bb_alarm: BB_alarm = {
            detail: rawAlarm.se_details,
            type: switchEventType(rawAlarm.extraAttribs.event_type),
            course_name: course_name,
            title: getTitle(rawAlarm.se_context, rawAlarm.extraAttribs.event_type),
            course_id: rawAlarm.se_courseId,
            color: color,
            date: rawAlarm.se_timestamp,
            url: rawAlarm.se_itemUri,
        }
        BB_alarmList.push(bb_alarm);
    });
    return BB_alarmList;
}