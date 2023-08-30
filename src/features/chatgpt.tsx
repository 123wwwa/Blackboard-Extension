/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { BB_alarm } from "type";

export const extractTodo = async (alarm:BB_alarm) => {
    let text = alarm.detail;
    let date = new Date(alarm.date);
    let subject = alarm.course_name;
    let title = alarm.title;
    let trimText = title + "\n Uploaded:" + date + "\n Course:" + subject + "\n";
    trimText += text.replace(/(<([^>]+)>)/g, "").trim();
    let prompt = "extract JSON key with one title and date(use timestamp and korean standard time) from the context you just only reply with JSON\n";
    prompt += trimText;
    alert(prompt);
    let res = await window.chrome.runtime.sendMessage({ action: "askgpt", prompt: prompt });
    if(res.error){
        alert(res.error);
        return;
    }
    alert(res.content);
    let todo = res.content;
    // trim the result
    let regExp = /\{([^)]+)\}/;
    todo = regExp.exec(todo)![0];
    todo = JSON.parse(todo);
    return todo;
};
export const askPrompt = async (text: string) => {
    let req = await window.chrome.runtime.sendMessage({ action: "askgpt", prompt: text });
    if(req.error){
        alert(req.error);
        return;
    }
    alert(req.content);
    let res = req.content;
    // trim the result
    //res.replace("choice", "").trim();
    return res;
}