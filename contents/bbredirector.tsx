import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ["*://bb.unist.ac.kr/*"],
}

window.location.href = window.location.href.replace("bb.unist.ac.kr", "blackboard.unist.ac.kr");