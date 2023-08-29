/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import GPTButton from './GPTButton';
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
const trimQuizText = (text: string) => {
    return text.replace(/\n/g, '').trim();
}
waitForElm().then(() => {
    const quizList = document.querySelectorAll(".field") as NodeListOf<HTMLElement>;
    const quizArea = document.querySelector("#dataCollectionContainer")?.children as HTMLCollectionOf<HTMLElement>;
    // loop in quizArea
    for(let i=0; i<quizArea.length; i++){
        const item = quizArea[i];
        if(item.className.includes("takeQuestionDiv")) { // quiz
            let question = item.querySelector(".legend-visible") as HTMLElement;
            let choices = item.querySelector(".multiple-choice-table")?.children[0].children as HTMLCollectionOf<HTMLElement>;
            let prompt:string = "Question" + trimQuizText(question.textContent!);
            // loop in choices
            for(let j=0; j<choices.length; j++){
                const choice = choices[j];
                let choiceText = trimQuizText(choice.textContent!);
                let index = j + 1;
                prompt += "\n"+ index + "." + choiceText;
            }
            const gptButton = document.createElement("button");
            gptButton.textContent = "GPT";
            gptButton.style.marginLeft = "10px";
            //append chatgpt button
            // item.prepend(gptButton);
            // const itemRoot = createRoot(item);
            // itemRoot.render(
            //     <React.StrictMode>
            //         <GPTButton prompt={prompt} />
            //     </React.StrictMode>
            // )

        }
    }
});