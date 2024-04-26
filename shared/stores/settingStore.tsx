import { create } from "zustand";

interface StoreState {
    isAlarmSet: boolean;
    alarmTime: number;
    isLogin: boolean;
    isAutoSave: boolean;
    isPreviousVersion: boolean;
    usePreviousViewer: boolean;
    userEmail: string;
    apiKey: string;
}
export const defaultSetting: StoreState = {
    isAlarmSet: true,
    alarmTime: 0,
    isLogin: false,
    isAutoSave: false,
    isPreviousVersion: false,
    usePreviousViewer: false,
    userEmail: "",
    apiKey: ""
};
interface StoreActions {
    updateSettings: (settings: Partial<StoreState>) => void;
    setAlarm: (isSet: boolean) => void;
    setAlarmTime: (time: number) => void;
    setUserEmail: (email: string) => void;
    setIsLogin: (isLogged: boolean) => void;
    setApiKey: (key: string) => void;
    setIsAutoSave: (isAutoSave: boolean) => void;
    setIsPreviousVersion: (isPrevious: boolean) => void;
    setUsePreviousViewer: (useViewer: boolean) => void;
}
type UseStore = StoreState & StoreActions;
const store = (set, get) => ({
    isAlarmSet: true,
    alarmTime: 0,
    isLogin: false,
    isAutoSave: false,
    isPreviousVersion: false,
    usePreviousViewer: false,
    userEmail: "",
    apiKey: "",

    // Methods to update state
    updateSettings: (settings) => set(state => ({ ...state, ...settings })),
    setAlarm: (isSet) => set({ isAlarmSet: isSet }),
    setAlarmTime: (time) => set({ alarmTime: time }),
    setUserEmail: (email) => set({ userEmail: email }),
    setIsLogin: (isLogged) => set({ isLogin: isLogged }),
    setApiKey: (key) => set({ apiKey: key }),
    setIsAutoSave: (isAutoSave) => set({ isAutoSave: isAutoSave }),
    setIsPreviousVersion: (isPrevious) => set({ isPreviousVersion: isPrevious }),
    setUsePreviousViewer: (useViewer) => set({ usePreviousViewer: useViewer }),
});
export const useSettingStore = create<UseStore>(store);
export const {setAlarm, setAlarmTime, setUserEmail, setIsLogin, setApiKey, setIsAutoSave, setIsPreviousVersion, setUsePreviousViewer, updateSettings} = useSettingStore.getState();