/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
// https://blackboard.unist.ac.kr/courses/1/2023_human_rights_edu/content/_292502_1/korean_all(student).html

const waitForElm = () => {
    return new Promise(resolve => {
        if (document.querySelector("#videoDiv")) {
            return resolve(document.querySelector("#videoDiv"));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector("#videoDiv")) {
                resolve(document.querySelector("#videoDiv"));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm().then(() => {
    console.log("video loaded");
    const playbackRateArea = document.querySelector("#playbackRates") as HTMLElement;
    // append 16x
    const playbackRate16x = document.createElement("option");
    playbackRate16x.value = "16";
    playbackRate16x.textContent = "16";
    playbackRateArea.appendChild(playbackRate16x);
});
export { };