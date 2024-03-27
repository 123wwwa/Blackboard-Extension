/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { createRoot } from "react-dom/client";
import GPTButton from "../GPTButton";
import React from "react";
import { PROD } from "../main";

const waitForElm = () => {
    return new Promise(resolve => {
        if (document.querySelector(".question-list.attempt-question-list")) {
            return resolve(document.querySelector(".question-list.attempt-question-list"));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(".question-list.attempt-question-list")) {
                resolve(document.querySelector(".question-list.attempt-question-list"));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const trimQuizText = (text: string) => {
    return text.replace(/\n/g, '').trim();
}
const handleMultipleChoice = (target: HTMLElement) => {
    const multiplechoiceQuestionArea = target.querySelector(".multiple-answer-question.question-container") as HTMLElement;
    const multiplechoiceChoicesArea = target.querySelector(".multiple-answer-answers-container") as HTMLElement;
    let prompt: string = "Just only write down choice number with choice ex)1.your choice\n";
    prompt += "Question\n" + trimQuizText(multiplechoiceQuestionArea.textContent!);
    prompt += "\nChoices";
    let choices = multiplechoiceChoicesArea.querySelector(".multiple-answer-answers")?.children as HTMLCollectionOf<HTMLElement>;
    for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        let choiceText = trimQuizText(choice.textContent!);
        let index = j + 1;
        prompt += "\n";
        if (!choiceText.startsWith(index + ".")) {
            prompt += index + "."
        }
        prompt += choiceText;
    }
    return prompt;
}
const handleTrueFalse = (target: HTMLElement) => {
    const trueorfalseQuetionArea = target.querySelector(".true-false-question.question-container") as HTMLElement;
    const trueorfalseChoicesArea = target.querySelector(".true-false-answers-container") as HTMLElement;
    const choicse = trueorfalseChoicesArea.querySelector(".true-false-answers")?.children as HTMLCollectionOf<HTMLElement>;
    let prompt: string = "Just only write down choice number with choice ex)1.your choice\n";
    prompt += "Question\n" + trimQuizText(trueorfalseQuetionArea.textContent!);
    prompt += "\nChoices";
    prompt += "\n1." + trimQuizText(choicse[0].textContent!);
    prompt += "\n2." + trimQuizText(choicse[1].textContent!);
    return prompt;
}
let url = window.location.href;
if (url.includes("assessment") && !PROD) {
    console.log("assessment");
    const handleAfterElementPresence = () => {
        const targetNode = document.querySelector(".question-list.attempt-question-list") as HTMLElement;
        console.log(targetNode);
        console.log(targetNode.children.length);
        for (let i = 0; i < targetNode.children.length; i++) {
            const target = targetNode.children[i] as HTMLElement;
            const multiplechoiceQuestionArea = target.querySelector(".multiple-answer-question.question-container") as HTMLElement;
            let prompt = "";
            if (multiplechoiceQuestionArea) {
                prompt = handleMultipleChoice(target);
            } else {
                prompt = handleTrueFalse(target);
            }
            const rootElement = document.createElement("div");
            target.prepend(rootElement);
            const itemRoot = createRoot(rootElement);
            itemRoot.render(
                <React.StrictMode>
                    <GPTButton prompt={prompt} index={i} />
                </React.StrictMode>
            )
        }
    }
    //observeElementPresence(".question-list.attempt-question-list", handleAfterElementPresence);
}
