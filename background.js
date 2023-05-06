chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if(request.action == 'updateTodo') {
        chrome.identity.getAuthToken({ 'interactive': true }, async(token) => {
            let event = {
                "summary": "Google I/O 2015",
                "start": {
                    "dateTime": "2023-11-28T09:00:00-07:00",
                    "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                "end": {
                    "dateTime": "2023-11-28T17:00:00-07:00",
                    "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                "colorId": 1,
                "description": "A chance to hear more about Google's developer products.",
                "source": {
                    "title": "Google I/O 2015",
                    "url": "https://google.com"
                },
            }
            const events = await getEvents(token);
            let calendarId = await getCalendarId(token);
            console.log(calendarId);
            console.log(events);
            // for (let i = 0; i < events.items.length; i++) {
            //     const element = events.items[i];
            //     if (element.summary == event.summary && element.start.dateTime == event.start.dateTime && element.end.dateTime == event.end.dateTime) {
            //         console.log('event already exists');
            //         return;
            //     }
            // }
            // postEvent(token,event, calendarId);
    
        });
    }

})
const getCalendarId = async (token) => {
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
    const req  = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init);
    const res = await req.json();
    return res;

}
const postEvent = async (token, event, calendarId) => {
    var init = {
        method: 'POST',
        async: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json',
        body: JSON.stringify(event)
    };
    let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', init).then((response) => {
        return response.json();
    }
    );
}