import { sendToBackground } from "@plasmohq/messaging";
import { getChromeStorage, setChromeStorage } from "~shared/storage";
import { defaultSetting, setIsLogin, setUserEmail, updateSettings } from "~shared/stores/settingStore";

export const reloadSetting = async () => {
    let settings = await getChromeStorage("settings", {});
    // check if settings is empty
    if (Object.keys(settings).length === 0 && settings.constructor === Object){
        setChromeStorage("settings", defaultSetting);
        settings = JSON.stringify(defaultSetting);
    } else {
        updateSettings(settings);
    }
    settings = JSON.parse(settings);
}
export const updateSetting = async ( key: string, value: any) => {
    let settings = await getChromeStorage("settings", {});
    settings = JSON.parse(settings);
    settings[key] = value;
    setChromeStorage("settings", settings);
    updateSettings(settings);
}
export const reloadUserEmail = async () => {
    const response = await sendToBackground({
        // @ts-ignore
        name: "getUserEmail",
    })
    if (response){
        setUserEmail(response);
        setIsLogin(true);
    }
}