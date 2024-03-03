/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
export const setChromeStorage = async (key: string, value: any) => {
    try {
        await window.chrome.storage.local.set({ [key]: value });
    } catch (e) {
        console.log(e);
    }
}
export const getChromeStorage: any = async (key: string, defaultValue: string) => {
    const data = await window.chrome.storage.local.get([key]);
    //console.log(data);
    if (!data[key]) {
        return defaultValue;
    }
    return data[key];
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

const QUOTA_BYTES_PER_ITEM: number = 8192/2;

// 크롬 스트로지에 저장할때 크롬 스트로지의 크기 제한을 넘어가면 저장이 안되는 문제가 있어서 크롬 스트로지의 크기를 넘어가지 않게 저장하는 함수
function getByteLength(normal_val: string): number {
    // Force string type
    normal_val = String(normal_val);
  
    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        byteLen += c < (1 << 7) ? 1 :
                   c < (1 << 11) ? 2 :
                   c < (1 << 16) ? 3 :
                   c < (1 << 21) ? 4 :
                   c < (1 << 26) ? 5 :
                   c < (1 << 31) ? 6 : Number.NaN;
    }
    return byteLen;
}
export function chunkObject(obj: { [key: string]: any }, keyBase: string, chunkSize: number): { [key: string]: string } {
    let items: { [key: string]: string } = {};

    let index = 0;
    let currentSize = 0;
    let currentItem: { [key: string]: any } = {};

    for (let key in obj) {
        let itemSize = getByteLength(JSON.stringify({ [key]: obj[key] }));
        if (currentSize + itemSize < chunkSize) {
            currentItem[key] = obj[key];
            currentSize += itemSize;
        } else {
            items[`${keyBase}_${index}`] = JSON.stringify(currentItem);
            currentItem = { [key]: obj[key] };
            currentSize = itemSize;
            index++;
        }
    }

    if (Object.keys(currentItem).length > 0) {
        items[`${keyBase}_${index}`] = JSON.stringify(currentItem);
    }

    return items;
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