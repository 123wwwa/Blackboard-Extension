/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { createSlice } from "@reduxjs/toolkit";
import { getChromeStorage, setChromeStorage } from "./handleChromeStoarge";
import { AppDispatch } from "./store";

export interface InitialSetting {
    isAlarmSet: boolean;
    alarmTime: number;
    isLogin: boolean;
    isAutoSave: boolean;
    userEmail: string;
    apiKey: string;
}
export const defaultSetting: InitialSetting = {
    isAlarmSet: true,
    alarmTime: 0,
    isLogin: false,
    isAutoSave: false,
    userEmail: "",
    apiKey: ""
};
export const settingSlice = createSlice({
    name: "settingSlice",
    initialState: defaultSetting,
    reducers: {
        setAlarm: (state, action) => {
            state.isAlarmSet = action.payload;
        },
        setAlarmTime: (state, action) => {
            state.alarmTime = action.payload;
        },
        setUserEmail: (state, action) => {
            state.userEmail = action.payload;
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        setSetting: (state, action) => {
            let key = action.payload.key;
            let value = action.payload.value;
            // chekc if key is in state
            // @ts-ignore
            if (state[key] === undefined) return;
            // @ts-ignore
            state[key] = value;
        },
        setApiKey: (state, action) => {
            state.apiKey = action.payload;
        },
        setIsAutoSave: (state, action) => {
            state.isAutoSave = action.payload;
        }

    }
});
export const { setAlarm, setAlarmTime, setUserEmail, setIsLogin, setApiKey, setIsAutoSave } = settingSlice.actions;

export const reloadSetting = async (dispatch: AppDispatch) => {
    let settings = await getChromeStorage("settings", "{}");
    // check if settings is empty
    if (settings === "{}") {
        setChromeStorage("settings", JSON.stringify(defaultSetting));
        settings = JSON.stringify(defaultSetting);
    } else {
        dispatch(setAlarm(JSON.parse(settings).isAlarmSet));
        dispatch(setAlarmTime(JSON.parse(settings).alarmTime));
        dispatch(setApiKey(JSON.parse(settings).apiKey));
    }
    settings = JSON.parse(settings);
}
export const updateSetting = async (dispatch: AppDispatch, key: string, value: any) => {
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    settings[key] = value;
    setChromeStorage("settings", JSON.stringify(settings));
    dispatch(setAlarm(settings.isAlarmSet));
    dispatch(setAlarmTime(settings.alarmTime));
    dispatch(setApiKey(settings.apiKey));
    dispatch(setIsAutoSave(settings.isAutoSave));
}
export const reloadUserEmail = async (dispatch: AppDispatch) => {
    const response = await window.chrome.runtime.sendMessage({ action: "getEmail" });
    if (response){
        dispatch(setUserEmail(response));
        dispatch(setIsLogin(true));
    }
}
export const selectAlarm = (state: any) => state.settingSlice.isAlarmSet;
export const selectAlarmTime = (state: any) => state.settingSlice.alarmTime;
export const selectIsLogin = (state: any) => state.settingSlice.isLogin;
export const selectUserEmail = (state: any) => state.settingSlice.userEmail;
export const selectApiKey = (state: any) => state.settingSlice.apiKey;
export const selectIsAutoSave = (state: any) => state.settingSlice.isAutoSave;