/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

export const askgpt = async (text: string) => {
    let trimText = text.replace(/(<([^>]+)>)/g, "").trim();
    const prompt = "extract JSON key with one title and javascript date(use timestamp and korean standard time) from the following context:"+ trimText;
    window.chrome.runtime.sendMessage({ action: "askgpt", prompt: prompt }, (response) => {
        if(response.error){
            alert(response.error);
            return;
        }
    }
    );
};
