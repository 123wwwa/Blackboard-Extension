import type { Todo } from "~shared/types/blackboardTypes";
import type { UserSetting } from "~shared/types/settingTypes";

let todoList: Todo[], calendarId: string;

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
const handleAskGpt = async (request: any, sendResponse: (response: any) => void): Promise<void> => {
    const apiKey = JSON.parse((await chrome.storage.local.get("settings")).settings).apiKey;
    console.log(request.options);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // replace with your key
        },
        body: JSON.stringify(request.options)
    });
    const data = await response.json();
    if (data.error) {
        sendResponse({"error": data.error.message});
        return;
    }
    sendResponse({"content": data.choices[0].message.content});
};
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: (response: any) => void) => {
    switch (request.name) {
        case 'updateTodo':
            handleUpdateTodo(request, sendResponse);
            break;
        case 'logout':
            handleLogout(sendResponse);
            break;
        case 'askgpt':
            handleAskGpt(request, sendResponse);
            return true;
        case 'getEmail':
            handleGetEmail(sendResponse);
            return true; // indicates we want to send a response asynchronously
    }
});
async function handleUpdateTodo(request: any, sendResponse: (response: any) => void): Promise<void> {
    if (checkAlreadyExists(todoList, request.todoList)) {
        sendDoneMessage();
        return;
    }

    todoList = request.todoList;
    let token = await authorize();
    const calendarEvents = await getEvents(token);
    let settings = (await chrome.storage.local.get("settings")).settings as UserSetting;

    for (let todo of todoList) {
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

    sendDoneMessage();
}
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleLogout(sendResponse: (response: any) => void): Promise<void> {
    let token = await chrome.identity.getAuthToken({ interactive: false });
    await chrome.identity.removeCachedAuthToken({ token: token });
}
async function handleGetEmail(sendResponse: (response: any) => void): Promise<void> {
    let userEmail = (await chrome.identity.getProfileUserInfo()).email;
    sendResponse(userEmail);
}
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
const sendDoneMessage = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'calendarUpdateDone' });
    });
}


const checkAlreadyExists = (prevEvents: Todo[], events: Todo[]): boolean => {
    if (!prevEvents) {
        return false;
    }
    return events.some(event => prevEvents.some(prevEvent => compareEvent(event, prevEvent)));
}

const compareEvent = (event1: Todo, event2: Todo): boolean => {
    return event1.content === event2.content;
}