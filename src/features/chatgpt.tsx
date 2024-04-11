/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { BB_alarm } from "type";
GlobalWorkerOptions.workerSrc = window.chrome.runtime.getURL('public/pdf.worker.mjs')
type AskGptOptions = {
    prompt: string;
    max_tokens: number;
    model: string;
    temperature: number;
}
export const extractTodo = async (alarm: BB_alarm) => {
    let text = alarm.detail;
    let date = new Date(alarm.date);
    let subject = alarm.course_name;
    let title = alarm.title;
    let trimText = title + "\n Uploaded At:" + date + "\n Course:" + subject + "\n";
    trimText += text.replace(/(<([^>]+)>)/g, "").trim();
    let prompt = `create JSON(should be parsed by JSON.parse) key with one title and date(korean standard time, 
        deadline or start time of the schedule it should be date(converted by new Date(date).getTime() ) ) from the context. you just only reply with JSON\n 
        ex) {"title":"title", "date":"date"}\n`;
    prompt += trimText;
    //alert(prompt);
    let options: AskGptOptions = {
        prompt: prompt,
        max_tokens: 100,
        model: "gpt-4",
        temperature: 0.1
    }
    let message = {
        action: "askgpt",
        options: options
    }
    let res = await window.chrome.runtime.sendMessage(message);
    if (res.error) {
        alert(res.error);
        return;
    }
    console.log(res.content);
    let todo = res.content;
    // trim the result
    let regExp = /\{([^)]+)\}/;
    //todo = regExp.exec(todo)![0];
    todo = JSON.parse(todo);
    return todo;
};
type PdfToText = {
    text: string;
    numPages: number;
}
export const pdfToTextList = async (url: string) => {
    const loadingTask = getDocument(url);
    const pdf = await loadingTask.promise;
    let text = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        text.push(textContent.items.map((item:any) => item.str).join(" ").split("•"));
    }
    return {
        text: text,
        numPages: pdf.numPages
    }
}
export const pdfToText = async (url: string) => {
    const loadingTask = getDocument(url);
    const pdf = await loadingTask.promise;
    let text = "";
    let num: number = 1;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        text += num.toString() + "페이지\n";
        text += textContent.items.map((item:any) => item.str).join(" ");
        num += 1;
    }
    return {
        text: text,
        numPages: pdf.numPages
    }
}
export const summarizePDF = async (url: string) => {
    let req = await pdfToText(url);
    let text = req.text;
    let numPages = req.numPages;
    let prompt = `아래 내용을 한국어로 요약하여 Markdown 형식으로 답변해주세요. 요약 시, 주요 포인트를 목록 형태로 제공하고, 각 섹션의 제목은 볼드체로 표시해주세요.`;
    prompt += `예시 답변 형식:
    **섹션 제목 1(일치하는 페이지 번호)**
    - 주요 포인트 1
    - 주요 포인트 2
    **섹션 제목 2(일치하는 페이지 번호)**
    - 주요 포인트 1
    - 주요 포인트 2`
    // prompt += "아래 탬플릿을 참고하여 markdown형식으로 작성해야만 한다.";
    // prompt +=`####요약: {페이지당 50자 이내로 요약하라. 
    // -1페이지:{50자이내} -2페이지:{50자이내} ..... -${numPages}페이지:{50자이내}}`;
    // prompt += "####키워드: {강의 내용의 키워드 제공하라.}";
    // prompt += `####핵심: {강의 내용의 핵심 문장 제공을 ${numPages*20}자 이내로 요약하라}`;
    prompt += `${text}`;
    let options: AskGptOptions = {
        prompt: prompt,
        max_tokens: 100*numPages,
        model: "gpt-3.5-turbo",
        temperature: 0.1
    }
    let message = {
        action: "askgpt",
        options: options
    }
    let res = await window.chrome.runtime.sendMessage(message);
    if (res.error) {
        alert(res.error);
        return "GPT 에러, 블랙보드 익스텐션 설정에서 api key를 확인해주세요";
    }
    return res.content;
}
export const askPrompt = async (text: string) => {
    let options: AskGptOptions = {
        prompt: text,
        max_tokens: 10,
        model: "gpt-4",
        temperature: 0.1
    };
    let message = {
        action : "askgpt",
        options: options
    }
    let req = await window.chrome.runtime.sendMessage(message);
    if (req.error) {
        alert(req.error);
        return;
    }
    let res = req.content;
    // trim the result
    //res.replace("choice", "").trim();
    return res;
}