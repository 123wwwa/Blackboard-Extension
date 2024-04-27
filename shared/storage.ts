import { Storage } from "@plasmohq/storage";

export const storage = new Storage();
export const setChromeStorage = async (key: string, value: any) => {
    try {
        // check if value is string
        if (typeof value === 'string') {
            await storage.set(key, value);
        } else {
            await storage.set(key, JSON.stringify(value));
        }
    } catch (e) {
        console.log(e);
    }
}
export const getChromeStorage: any = async (key: string, defaultValue:any) => {
    const data = await storage.get(key);
    if (!data) {
        return defaultValue;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}
export const setChromeStorageList = async (baseKey: string, values: any[]) => {
    // set values to chrome storage with key baseKey_0, baseKey_1, baseKey_2, ...
    let index = 0;
    
    while (true) {
        let key = `${baseKey}_${index}`;
        let value = await getChromeStorage(key, null);
        if(index < values.length) {
            await setChromeStorage(key, values[index]);
        }
        else {
            await setChromeStorage(key, null);
        }
        if (value === null) break;
        index++;
    }
}
export const getChromeStorageList = async (baseKey: string) => {
    // get values from chrome storage with key baseKey_0, baseKey_1, baseKey_2, ...
    let index = 0;
    let values = [];
    while (true) {
        let key = `${baseKey}_${index}`;
        let value = await getChromeStorage(key, null);
        if (value === null) break;
        values.push(value);
        index++;
    }
    return values;
}