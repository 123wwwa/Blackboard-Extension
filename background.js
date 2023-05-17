let calendarId;
let todoList;
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action == 'updateTodo') {
        // check if todoList changed
        if (checkAlreadyExists(todoList, request.todoList)) {
            sendDoneMessage();
            return;
        }
        todoList = request.todoList;
        let token = await authorize();
        const calendarEvents = await getEvents(token);
        //let calendarId = await getCalendarId(token);
        for (let i = 0; i < todoList.length; i++) {
            let todo = todoList[i];
            let event = {
                "summary": todo.content,
                "start": {
                    "dateTime": new Date(todo.date).toISOString(),
                    "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                "end": {
                    "dateTime": new Date(todo.date + 60 * 1000).toISOString(),
                    "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };
            if(todo.linkcode){
                event.description = "https://blackboard.unist.ac.kr/webapps/calendar/launch/attempt/"+todo.linkcode;
            }
            //console.log(calendarEvents);
            //loop in calendar events and check if event already exists
            if(!calendarEvents.items){
                console.log('no events');
                token = await authorize();
                postEvent(token, event, calendarId);
                continue;
            }
            let exists = false;
            calendarEvents.items.forEach((element) => {               
                if (compareEvent(element, event)) {
                    //console.log('event already exists');
                    exists = true;
                }
            });
            
            //post event
            if (!exists) {
                token = await authorize();
                postEvent(token, event, calendarId);
            }
        }
        //post message when done
        sendDoneMessage();
    }

})
const sendDoneMessage = () =>{
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
    if (event1.summary == event2.summary) {
        return true;
    }
    return false;
}
const authorize = () => {
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
const getCalendarId = async (token) => {
    if (calendarId) {
        return calendarId;
    }
    var init = {
        method: 'GET',
        async: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };
    const req = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', init);
    const res = await req.json();
    calendarId = res.items[0].id;
    return res.items[0].id;
}

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
    const req = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init);
    const res = await req.json();
    return res;

}
const postEvent = async (token, event, calendarId) => {
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
    //https://content.googleapis.com/calendar/v3/calendars/primary/events?alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM
    
    let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`
    const req = await fetch(url, init);
    const res = await req.json();
    //console.log(res);
}