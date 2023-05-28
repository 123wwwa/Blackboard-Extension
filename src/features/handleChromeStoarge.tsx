/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
export const setChromeStorage = async (key: string, value: any) => {
    window.chrome.storage.sync.set({ [key]: value });
}
export const getChromeStorage: any = async (key: string, defaultValue: string) => {
    const data = await window.chrome.storage.sync.get([key]);
    //console.log(data);
    if (!data[key]) {
        return defaultValue;
    }
    return data[key];
}
export const APIwithcatch = async (url: string, header: string) => {
    try {
        var response = await fetch(url, JSON.parse(header));
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch (e) {
        return null;
    }
}