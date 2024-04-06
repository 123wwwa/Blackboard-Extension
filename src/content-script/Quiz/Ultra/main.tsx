/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { createRoot } from "react-dom/client";
import GPTButton from "../GPTButton";
import React from "react";
import { PROD } from "../main";
import { observeUrlChange } from "../../../content-script/SPA_Observer/SPA_Observer";


const trimQuizText = (text: string) => {
    return text.replace(/\n/g, '').trim();
}
const handleMultipleChoice = (target: HTMLElement) => {
    const multiplechoiceQuestionArea = target.querySelector(".multiple-answer-question.question-container") as HTMLElement;
    const multiplechoiceChoicesArea = target.querySelector(".multiple-answer-answers-container") as HTMLElement;
    let prompt: string = "Just only write down choice number with choice ex)1.your choice\n";
    prompt += "If there is multiple choice, write down all the choices with number separete with comma\n ex) 1. choice1,2.choice2,3.choice3,4.choice4\n"
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
    prompt += "this question is true or false\n";
    prompt += "Question\n" + trimQuizText(trueorfalseQuetionArea.textContent!);
    prompt += "\nChoices";
    prompt += "\n1." + trimQuizText(choicse[0].textContent!);
    prompt += "\n2." + trimQuizText(choicse[1].textContent!);
    return prompt;
}
const handleFIMB = (target: HTMLElement) => {
    const fimbQuestionArea = target.querySelector("div[class^='fimb-question-container']") as HTMLElement;
    const fimbChoicesArea = target.querySelector("fimb-answers-container") as HTMLElement;
    let prompt: string = "FIMB fill in the missing blanks\n";
    prompt += "Just only write down blank number with answer separate with comma ex)1.blank1,2.blank2,3.blank3,4.blank4\n";
    prompt += "Question\n" + trimQuizText(fimbQuestionArea.textContent!);
    return prompt;
}
const observeElementPresenceOnce = (callback: (exists: boolean) => void): void => {
    let hasElementBeenObserved = false; // 요소가 관찰되었는지 추적하는 플래그
  
    const observerCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
        if (!hasElementBeenObserved) {
            let element = document.querySelector(".question-list.attempt-question-list")?.children[0];
            let elementText = element?.textContent?.trim();
            if (elementText) {
                callback(true);
                hasElementBeenObserved = true; // 요소가 발견되었으므로 플래그를 true로 설정
                observer.disconnect(); // 더 이상의 변화를 관찰할 필요가 없으므로 관찰자 연결 해제
            }
        }
    };
  
    const observer = new MutationObserver(observerCallback);
  
    const config = { childList: true, subtree: true };
  
    observer.observe(document.body, config);
  
    // 초기 상태 체크: 문서가 이미 로드된 상태에서 스크립트가 실행될 경우를 대비
    observerCallback([], observer);
  };
(async () => {
    observeUrlChange((url) => {
        if (url.includes("assessment") && !PROD) {
            const handleAfterElementPresence = (exist: boolean) => {
                if (!exist) return;
                // check if className is gpt-button
                if (document.querySelector(".gpt-button")) return;
                const targetNode = document.querySelector(".question-list.attempt-question-list") as HTMLElement;

                for (let i = 0; i < targetNode.children.length; i++) {
                    let questionType = "";
                    const target = targetNode.children[i] as HTMLElement;
                    //console.log(target);
                    if (target.querySelector(".gpt-button")) return;
                    const multiplechoiceQuestionArea = target.querySelector(".multiple-answer-question.question-container") as HTMLElement;
                    const trueFalseQuestionArea = target.querySelector(".true-false-answers-container") as HTMLElement;
                    const fimbQuestionArea = target.querySelector(".fimb-answers-container") as HTMLElement;
                    let prompt = "";
                    if (multiplechoiceQuestionArea) {
                        prompt = handleMultipleChoice(target);
                        questionType = "multiplechoice";
                    } 
                    if (trueFalseQuestionArea) {
                        prompt = handleTrueFalse(target);
                        questionType = "truefalse";
                    }
                    if (fimbQuestionArea) {
                        prompt = handleFIMB(target);
                        questionType = "fimb";
                    }

                    
                    // check if className is gpt-button
                    const rootElement = document.createElement("div");
                    target.prepend(rootElement);
                    const itemRoot = createRoot(rootElement!);
                    itemRoot.render(
                        <React.StrictMode>
                            <GPTButton prompt={prompt} index={i} questionType={questionType} />
                        </React.StrictMode>
                    )
                }
            }
            observeElementPresenceOnce(handleAfterElementPresence);
        }
    })
})()
