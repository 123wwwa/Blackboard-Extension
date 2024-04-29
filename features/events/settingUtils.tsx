import { sendToBackground } from "@plasmohq/messaging";
import { type RequestBody, type ResponseBody } from "~background/messages/email";
import { getChromeStorage, setChromeStorage } from "~shared/storage";
import { defaultSetting, setIsLogin, setUserEmail, updateSettings } from "~shared/stores/settingStore";

export const reloadSetting = async () => {
    let settings = await getChromeStorage("settings", {});
    // check if settings is empty
    if (Object.keys(settings).length === 0 && settings.constructor === Object){
        setChromeStorage("settings", defaultSetting);
        settings = defaultSetting;
    } else {
        updateSettings(settings);
    }
    settings = settings;
}
export const updateSetting = async ( key: string, value: any) => {
    let settings = await getChromeStorage("settings", {});
    settings[key] = value;
    setChromeStorage("settings", settings);
    updateSettings(settings);
}
export const reloadUserEmail = async () => {
    const response = await sendToBackground<RequestBody,ResponseBody>({
        //@ts-ignore
        name: "email",
        body: {}
    })
    if (response){
        setUserEmail(response);
        setIsLogin(true);
    }
}