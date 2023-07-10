/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
export const setChromeStorage = async (key: string, value: any) => {
    window.chrome.storage.sync.set({ [key]: value });
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
type StorageObject = { [key: string]: any };
export function  storeData(key: string, newData: StorageObject): void {
    // Step 1: Get the existing data
    chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

        // Step 2: Merge the existing data with the new data
        let oldData: StorageObject = result[key] || {};
        let mergedData: StorageObject = { ...oldData, ...newData };

        // Step 3: Split the merged data into chunks and save each chunk
        let chunkedData = chunkObject(mergedData, key, QUOTA_BYTES_PER_ITEM);

        for (let chunkKey in chunkedData) {
            let dataToStore: StorageObject = {};
            dataToStore[chunkKey] = chunkedData[chunkKey];

            chrome.storage.sync.set(dataToStore, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Failed to store data for chunk ${chunkKey}: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log(`Chunk ${chunkKey} stored successfully!`);
                }
            });
        }
    });
}


export const retrieveData = (key: string, callback: (obj: any) => void) => {
    chrome.storage.sync.get(null, function(items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            callback(null);
        } else {
            // Get the keys that match the pattern (key_number)
            let keys = Object.keys(items).filter(k => k.startsWith(key));
            if (keys.length === 0) {
                callback(null);
                return;
            }

            // Sort keys to ensure data is in the correct order
            keys.sort((a, b) => {
                let aNum = parseInt(a.substring(key.length + 1));
                let bNum = parseInt(b.substring(key.length + 1));
                return aNum - bNum;
            });

            // Combine chunks back into a single string
            let jsonString = keys.map(k => items[k]).join("");

            // Convert back to an object
            let obj = JSON.parse(jsonString);

            callback(obj);
        }
    });
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