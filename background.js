let todoList, calendarId;
const authorize = async () => {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
};

const getEvents = async (token) => {
    var init = {
        method: 'GET',
        async: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init);
    return response.json();
};

const postEvent = async (token, event) => {
    var init = {
        method: 'POST',
        async: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'origin': 'chrome-extension://' + chrome.runtime.id,
            "Referer": location.href
        },
        body: JSON.stringify(event)
    };
    let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`
    const response = await fetch(url, init);
    return response.json();
};
const handleAskGpt = async (request, sendResponse) => {
    const apiKey = JSON.parse((await chrome.storage.local.get("settings")).settings).apiKey;
    console.log(request.options)
    const prompt = request.options.prompt;
    const maxTokens = request.options.maxTokens;
    const model = request.options.model;
    const temperature = request.options.temperature;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // replace with your key
        },
        body: JSON.stringify({
            messages: [{"role": "user", "content":prompt}],
            max_tokens: maxTokens,
            model : model,
            temperature: temperature,
            n: 1,
        })
    });
    const data = await response.json();
    // handle error message
    if (data.error) {
        sendResponse({"error": data.error.message});
        return;
    }
    //console.log(data.choices[0].message.content);
    sendResponse({"content":data.choices[0].message.content});
    return;
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
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

async function handleUpdateTodo(request, sendResponse) {
    if (checkAlreadyExists(todoList, request.todoList)) {
        sendDoneMessage();
        return;
    }

    todoList = request.todoList;
    let token = await authorize();
    const calendarEvents = await getEvents(token);
    let settings = (await chrome.storage.local.get("settings")).settings;

    for (let todo of todoList) {
        let event = createEventFromTodo(todo, settings);

        let exists = false;
        if (calendarEvents.items) {
            exists = calendarEvents.items.some(existingEvent => compareEvent(existingEvent, event));
        }

        if (!exists) {
            await postEvent(token, event);
            await delay(200);
        }
    }

    sendDoneMessage();
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleLogout(sendResponse) {
    let token = await chrome.identity.getAuthToken({ interactive: false });
    await chrome.identity.removeCachedAuthToken({ token: token });
}

async function handleGetEmail(sendResponse) {
    let userEmail = (await chrome.identity.getProfileUserInfo()).email;
    sendResponse(userEmail);
}

function createEventFromTodo(todo, settings) {
    let event = {
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

const sendDoneMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'calendarUpdateDone' });
    });
}

const checkAlreadyExists = (prevEvents, events) => {
    if (!prevEvents) {
        return false;
    }
    let exists = false;
    events.forEach((element) => {
        prevEvents.forEach((prevElement) => {
            if (compareEvent(element, prevElement)) {
                exists = true;
            }
        });
    });
    return exists;
}

const compareEvent = (event1, event2) => {
    return event1.summary === event2.summary;
}
