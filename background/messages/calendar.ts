import type { PlasmoMessaging } from "@plasmohq/messaging";
import { getChromeStorage } from "~shared/storage";
import type { Todo } from "~shared/types/blackboardTypes";
import type { UserSetting } from "~shared/types/settingTypes";
export type RequestBody = {
    todoList: Todo[];
}
export type ResponseBody = {
    isUpdated: boolean;
}

const handler: PlasmoMessaging.PortHandler<RequestBody, ResponseBody> = async (req, res) => {
    const reqTodoList = req.body.todoList;
    let token = await authorize();
    const calendarEvents = await getEvents(token);
    let settings = await getChromeStorage("settings")
    for (let todo of reqTodoList) {
        let event = createEventFromTodo(todo, settings);
        let exists = false;
        if (calendarEvents.items) {
            exists = calendarEvents.items.some((existingEvent: any) => compareEvent(existingEvent, event));
        }
        if (!exists) {
            await postEvent(token, event);
            await delay(200);
        }
    }
    res.send({ isUpdated: true });
}
const getEvents = async (token: string): Promise<any> => {
    const init: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init);
    return response.json();
};
const postEvent = async (token: string, event:any): Promise<any> => {
    const init: RequestInit = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'origin': 'chrome-extension://' + chrome.runtime.id,
            "Referer": location.href
        },
        body: JSON.stringify(event)
    };
    const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const response = await fetch(url, init);
    return response.json();
};
function createEventFromTodo(todo: Todo, settings: UserSetting):any {
    let event:any = {
        "summary": todo.content,
        "start": {
            "dateTime": new Date(todo.date).toISOString(),
            "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        "end": {
            "dateTime": new Date(todo.date + 60 * 1000).toISOString(),
            "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
        },
    };

    if (todo.linkcode) {
        event.description = "https://blackboard.unist.ac.kr/webapps/calendar/launch/attempt/" + todo.linkcode;
    }
    if (settings.isAlarmSet) {
        event.reminders = {
            "useDefault": false,
            "overrides": [
                { "method": "popup", "minutes": settings.alarmTime }
            ]
        }
    }
    return event;
}
const authorize = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token: string | undefined) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
};
const checkAlreadyExists = (prevEvents: Todo[], events: Todo[]): boolean => {
    if (!prevEvents) {
        return false;
    }
    return events.some(event => prevEvents.some(prevEvent => compareEvent(event, prevEvent)));
}

const compareEvent = (event1: Todo, event2: Todo): boolean => {
    return event1.content === event2.content;
}
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default handler