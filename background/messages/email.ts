import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = {}
export type ResponseBody = string
const handler: PlasmoMessaging.MessageHandler = async (req: any, res) => {
    chrome.identity.getProfileUserInfo((userInfo) => {
        res.send(userInfo.email);
    });
}
export default handler  