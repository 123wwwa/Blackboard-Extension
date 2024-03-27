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
    isPreviousVersion: boolean;
    usePreviousViewer: boolean;
    userEmail: string;
    apiKey: string;
}
export const defaultSetting: InitialSetting = {
    isAlarmSet: true,
    alarmTime: 0,
    isLogin: false,
    isAutoSave: false,
    isPreviousVersion: false,
    usePreviousViewer: false,
    userEmail: "",
    apiKey: ""
};
export const settingSlice = createSlice({
    name: "settingSlice",
    initialState: defaultSetting,
    reducers: {
        updateSettings: (state, action) => {
            // update every settings in chrome storage
            let settings = action.payload;
            // loop in settings
            for (let key in settings) {
                // @ts-ignore
                state[key] = settings[key];
            }

        },
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
        },
        setIsPreviousVersion: (state, action) => {
            state.isPreviousVersion = action.payload;
        },
        setUsePreviousViewer: (state, action) => {
            state.usePreviousViewer = action.payload;
        }

    }
});
export const { setAlarm, setAlarmTime, setUserEmail, setIsLogin, setApiKey, setIsAutoSave, setIsPreviousVersion, setUsePreviousViewer, updateSettings } = settingSlice.actions;

export const reloadSetting = async (dispatch: AppDispatch) => {
    let settings = await getChromeStorage("settings", "{}");
    // check if settings is empty
    if (settings === "{}") {
        setChromeStorage("settings", JSON.stringify(defaultSetting));
        settings = JSON.stringify(defaultSetting);
    } else {
        dispatch(updateSettings(JSON.parse(settings)));
    }
    settings = JSON.parse(settings);
}
export const updateSetting = async (dispatch: AppDispatch, key: string, value: any) => {
    let settings = await getChromeStorage("settings", "{}");
    settings = JSON.parse(settings);
    settings[key] = value;
    setChromeStorage("settings", JSON.stringify(settings));
    dispatch(updateSettings(settings));
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
export const selectIsPreviousVersion = (state: any) => state.settingSlice.isPreviousVersion;
export const selectIsAutoSave = (state: any) => state.settingSlice.isAutoSave;
export const selectUsePreviousViewer = (state: any) => state.settingSlice.usePreviousViewer;