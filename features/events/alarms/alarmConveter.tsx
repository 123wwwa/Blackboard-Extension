import type { BB_alarm, Lecture, LectureObject, RawAlarm } from "~shared/types/blackboardTypes"
import { getChromeStorage } from "../../../shared/storage"
import { eventTypeList } from "~shared/types/eventTypes"


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
const courseIdToName = (course_id: string, lecturelist:LectureObject) => {
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
const courseIdToColor = (course_id: string, lecturelist: LectureObject) => {
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
    let lectureInfoStr = await getChromeStorage("lectureInfo", {});
    let resLecturelist: LectureObject = lectureInfoStr;
    let BB_alarmList: BB_alarm[] = [];
    rawBB_alarmList.forEach((rawAlarm: RawAlarm) => {
        let course_name = courseIdToName(rawAlarm.se_courseId, resLecturelist);
        let color = courseIdToColor(rawAlarm.se_courseId, resLecturelist);
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