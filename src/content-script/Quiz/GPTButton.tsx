import styled from "@emotion/styled";
import { askPrompt } from "../../features/chatgpt";
type Props = {
    prompt: string;
    index: number;
    questionType: string;
}
const styles = {
    GPTButton: styled.button`
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 10px;
        background-color: #ffffff;
        color: #686868;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        &:focus {
            outline: none;
        }
    `
}
const GPTButton = ({ prompt, index, questionType }: Props) => {
    let isUltra = window.location.href.includes("ultra");
    let quizArea = document.querySelector("#dataCollectionContainer")?.children[index];
    if (isUltra) {
        quizArea = document.querySelector(".question-list.attempt-question-list")?.children[index];
    }
    const handleClick = (answer: string) => {
        let optionList = quizArea?.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        //loop in optionList
        for (let i = 0; i < optionList.length; i++) {
            const item = optionList[i];
            if (!item.id.includes("ans")) {
                //remove from optionList
                optionList[i].remove();
            }
        }
        let multipleAnswer = answer.split(",");
        for (let i = 0; i < multipleAnswer.length; i++) {
            let answer = multipleAnswer[i];
            for (let j = 0; j < optionList.length; j++) {
                let startWithCheck = j + 1 + ".";
                if (answer.startsWith(startWithCheck)) {
                    optionList[j]?.click();
                    break;
                }
            }
            // if (answer.startsWith("1.")) {
            //     optionList[0]?.click();
            // }
            // else if (answer.startsWith("2.")) {
            //     optionList[1]?.click();
            // }
            // else if (answer.startsWith("3.")) {
            //     optionList[2]?.click();
            // }
            // else if (answer.startsWith("4.")) {
            //     optionList[3]?.click();
            // }
            // else if (answer.startsWith("5.")) {
            //     optionList[4]?.click();
            // }
        }
    }
    const handleFIMB = (answer: string) => {
        let optionList = quizArea?.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        let multipleAnswer = answer.split(",");
        for (let i = 0; i < multipleAnswer.length; i++) {
            let answer = multipleAnswer[i];
            for (let j = 0; j < optionList.length; j++) {
                let startWithCheck = j + 1 + ".";
                if (answer.startsWith(startWithCheck)) {
                    optionList[j].value = answer.replace(startWithCheck, "");
                    break;
                }
            }
        }
    }
    const handleOnClick = async () => {
        //alert(prompt.replace("Just only write down choice number with choice ex)1.your choice", ""));
        let expectedAnswer = await askPrompt(prompt);
        if (expectedAnswer === "") {
            alert("GPT-4가 답을 찾지 못했습니다.");
            return;
        }
        if(questionType == "fimb"){
            handleFIMB(expectedAnswer);
        }else{
            handleClick(expectedAnswer);
        }
    }
    return (
        <>
            <button id="gpt-button" onClick={handleOnClick} css={styles.GPTButton}
                style={{ marginLeft: "200px", width: "100px", minHeight: "30px" }} className="gpt-button">
            </button>
        </>
    );
}
export default GPTButton;