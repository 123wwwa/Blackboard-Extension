import { setAlarmList } from "~shared/stores/lectureStore";
import { getChromeStorage, setChromeStorage } from "../../../shared/storage";
import { convertBB_alarm } from "./alarmConveter";

export const updateAlarmList = async () => {
    // check if last fetch is within 5 minutes
    let lastAlarmFetch = await getChromeStorage("lastAlarmFetch", 0);
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
        let BB_alarms = await getChromeStorage("BB_alarms", []);
        setAlarmList(BB_alarms);
        return;
    }
    let BB_alarms = await convertBB_alarm(alarmListStr);
    setAlarmList(BB_alarms)
    await setChromeStorage("BB_alarms", BB_alarms);
    await setChromeStorage("lastAlarmFetch", Date.now().toString());
};
