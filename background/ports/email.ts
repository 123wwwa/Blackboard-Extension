import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.PortHandler = async (req: any, res) => {
    chrome.identity.getProfileUserInfo((userInfo) => {
        res.send(userInfo.email);
    });
}
export default handler