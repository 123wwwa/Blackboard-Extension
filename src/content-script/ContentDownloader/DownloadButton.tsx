import JSZip from "jszip";
import { useState } from "react";
import mime from "mime-types";
import { faDownload, faSpinner} from "@fortawesome/free-solid-svg-icons";
import ActionIcon from "../Todo/common/ActionIcon";
import styled from "@emotion/styled";

const DownloadButton = styled.button`
    background-color: #00748b;
    color: white;
    border: none;
    border-radius: 5px;
    height: 40px;
    width: 110px;
    padding: 5px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    &:hover {
        cursor: pointer;
        filter: brightness(80%);
    }
`;
const DownloadArea = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [urlItems, setUrlItems] = useState([] as string[]);
    const urlToFileType = async (url: string): Promise<{ blob: Blob, fileFormat: string }> => {
        const response = await fetch(url);
        const blob = await response.blob();
        //const fileFormat = "." + blob.type.split("/")[1];
        const fileFormat = mime.extension(blob.type) ? "." + mime.extension(blob.type) : "";
        return { blob, fileFormat };
    };
    const downloadAll = async() => {
        const listContainer = document.getElementById("content_listContainer") as HTMLElement;
        setIsDownloading(true);
        let zip = new JSZip();
        for(let i = 0; i < listContainer.children.length; i++) {
            const item = listContainer.children[i];
            const link = item.querySelectorAll('a[href*="/bbcswebdav"]') as NodeListOf<HTMLAnchorElement>;
            const checkbox = item.querySelector('.downloadCheckBox') as HTMLInputElement;
            if(!checkbox.checked) continue;
            for(let j = 0; j < link.length; j++) {
                const { blob, fileFormat } = await urlToFileType(link[j].href);
                zip.file(link[j].text.trim() + fileFormat, blob, { binary: true });
            }
        }
        // for (const link of allLinks) {
        //     //check if checked
        //     const parent = link.parentElement?.parentElement?.parentElement;
        //     const checkbox = parent?.children[0].children[0] as HTMLInputElement;
        //     if(!checkbox.checked) continue;
        //     const { blob, fileFormat } = await urlToFileType(link.href);
        //     zip.file(link.text.trim() + fileFormat, blob, { binary: true });
        // }
        let lectureName = document.querySelector("#crumb_1")?.textContent?.trim();
        let fileName = document.querySelector("#pageTitleText")?.textContent?.trim();
        zip.generateAsync({ type: "blob" }).then((content) => {
            const a = document.createElement("a");
            const url = URL.createObjectURL(content);
            a.href = url;
            a.download = `${lectureName}_${fileName}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            setIsDownloading(false);
        });
    }
    const checkAll = () => {
        let listContainer = document.getElementById("content_listContainer") as HTMLElement;
        let checkBoxlist = document.querySelectorAll(".downloadCheckBox");
        let checkCount = 0;
        for(let i=0; i<checkBoxlist.length; i++){
            const checkbox = checkBoxlist[i] as HTMLInputElement;
            if(checkbox.checked) checkCount++;
        }
        if(checkCount === listContainer.children.length) {
            // uncheck all
            for(let i=0; i<listContainer.children.length; i++){
                const item = listContainer.children[i] as HTMLElement;
                const checkbox = item.querySelector('.downloadCheckBox') as HTMLInputElement;
                checkbox.checked = false;
            }
        }else {
            // check all
            for(let i=0; i<listContainer.children.length; i++){
                const item = listContainer.children[i] as HTMLElement;
                const checkbox = item.querySelector('.downloadCheckBox') as HTMLInputElement;
                checkbox.checked = true;
            }
        }
    }

    return (
        <div style={{display:"flex", flexDirection:"row"}}>
            <div style={{width:"50px", height: "50px"}}>
                <label htmlFor="selectAll">전체선택</label>
                <input type="checkbox" id="selectAll" onClick={checkAll}/>
            </div>
            { !isDownloading ? 
            <DownloadButton onClick={downloadAll}>
                선택 다운로드
                <ActionIcon icon={faDownload} />
            </DownloadButton> :
            <DownloadButton onClick={downloadAll}>
                다운로드 중
                <ActionIcon icon={faSpinner} />
            </DownloadButton>
            }
            
        </div>
    )
}
export default DownloadArea;