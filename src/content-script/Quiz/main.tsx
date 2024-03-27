/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import GPTButton from './GPTButton';
export const PROD = false;
const waitForElm = () => {
    return new Promise(resolve => {
        if (document.querySelector("#dataCollectionContainer")) {
            return resolve(document.querySelector("#dataCollectionContainer"));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector("#dataCollectionContainer")) {
                resolve(document.querySelector("#dataCollectionContainer"));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const handleMultipleChoice = (target: HTMLElement) => {
    let question = target.querySelector(".legend-visible") as HTMLElement;
    let choices = target.querySelector(".multiple-choice-table")?.children[0].children as HTMLCollectionOf<HTMLElement>;
    let prompt: string = "Just only write down choice number with choice ex)1.your choice\n";
    prompt += "Question\n" + trimQuizText(question.textContent!);
    // loop in choices
    prompt += "\nChoices";
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
    let questionArea = target.querySelector("fieldset")?.children as HTMLCollectionOf<HTMLElement>;
    let prompt: string = "Just only write down choice number with choice ex)1.your choice\n";
    prompt += "Question\n" + trimQuizText(questionArea[0].textContent!);
    prompt += "\nChoices";
    prompt += "\n1." + trimQuizText(questionArea[1].textContent!);
    prompt += "\n2." + trimQuizText(questionArea[2].textContent!);
    return prompt;
}
// const callBack = (mutationsList: MutationRecord[], observer: MutationObserver) => {
//     // check for child added
//     for (const mutation of mutationsList) {
//         console.log(mutation);
//         //check className
//         if (mutation.type === "childList") {
//             const target = mutation.target as HTMLElement;
//             if (target.className.includes("takeQuestionDiv")) { // quiz
//                 let index = target.querySelector(".steptitle")?.id.replace("steptitle", "") as string;
//                 let prompt;
//                 let choiceArea = target.querySelector(".multiple-choice-table");
//                 // check if choiceArea exists
//                 if (choiceArea) {
//                     prompt = handleMultipleChoice(target);
//                 }
//                 else {
//                     prompt = handleTrueFalse(target);
//                 }
//                 const rootEl = document.createElement("div");
//                 //append chatgpt button
//                 target.prepend(rootEl);
//                 const itemRoot = createRoot(rootEl!);
//                 itemRoot.render(
//                     <React.StrictMode>
//                         <GPTButton prompt={prompt} index={parseInt(index)} />
//                     </React.StrictMode>
//                 )
//             }
//         }
//     }
// }
const trimQuizText = (text: string) => {
    return text.replace(/\n/g, '').trim();
}
waitForElm().then(() => {
    if(PROD) return;
    const targetNode = document.querySelector("#dataCollectionContainer") as HTMLElement;
    for (let i = 0; i < targetNode.children.length; i++) {
        const target = targetNode.children[i] as HTMLElement;
        if (target.className.includes("takeQuestionDiv")) { // quiz
            let index = target.querySelector(".steptitle")?.id.replace("steptitle", "") as string;
            let prompt;
            let choiceArea = target.querySelector(".multiple-choice-table");
            // check if choiceArea exists
            if (choiceArea) {
                prompt = handleMultipleChoice(target);
            }
            else {
                prompt = handleTrueFalse(target);
            }
            // check if there is classname gpt-button
            if(target.querySelector(".gpt-button")) return;
            const rootEl = document.createElement("div");
            //append chatgpt button
            target.prepend(rootEl);
            const itemRoot = createRoot(rootEl!);
            itemRoot.render(
                <React.StrictMode>
                    <GPTButton prompt={prompt} index={parseInt(index)} />
                </React.StrictMode>
            )
        }
    }
});
// ,
//     {
//       "matches" :[
//         "https://blackboard.unist.ac.kr/webapps/assessment/take/launch.jsp*"
//       ],
//       "js": [
//         "src/content-script/Quiz/main.tsx"
//       ]
//     }