import JSZip from "jszip";
import { useState } from "react";
import mime from "mime-types";
import { faDownload, faSpinner} from "@fortawesome/free-solid-svg-icons";
import ActionIcon from "../Todo/common/ActionIcon";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DownloadButton = styled.button`
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 2.5px;
    height: 32px;
    width: 120px;
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
const SelectAllArea = styled.div`
    width: 50px;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const DownloadArea = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [urlItems, setUrlItems] = useState([] as string[]);
    const [progress, setProgress] = useState(0);
    const urlToFileType = async (url: string): Promise<{ blob: Blob, fileFormat: string, status: boolean }> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileFormat = mime.extension(blob.type) ? "." + mime.extension(blob.type) : "";
            //console.log(fileFormat);
            return { blob, fileFormat , status: true};
        } catch (error) {
            // Log the error if needed
            console.error('Fetch failed:', error);
            return { blob: new Blob(), fileFormat: "" , status: false};
        }
    };
    const downloadAll = async() => {
        const listContainer = document.getElementById("content_listContainer") as HTMLElement;
        setIsDownloading(true);
        let zip = new JSZip();
        for(let i = 0; i < listContainer.children.length; i++) {
            const item = listContainer.children[i];
            let link = item.querySelectorAll('a[href*="/bbcswebdav"]') as NodeListOf<HTMLAnchorElement>;
            if(link.length === 0) link = item.querySelectorAll('a[href*="/webapps/assignment/uploadAssignment"]') as NodeListOf<HTMLAnchorElement>;
            // push link2 to link

            const checkbox = item.querySelector('.downloadCheckBox') as HTMLInputElement;
            if(!checkbox.checked) continue;
            for(let j = 0; j < link.length; j++) {
                const { blob, fileFormat, status } = await urlToFileType(link[j].href);
                if(!status) continue;
                setProgress((i*link.length + j) / (listContainer.children.length * link.length) * 100);
                zip.file(link[j].text.trim() + fileFormat, blob, { binary: true });
            }
        }
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
        <div style={{display:"flex", flexDirection:"row", justifyContent: "center", alignItems: "center", gap: "15px"}}>
            <SelectAllArea>
                <label htmlFor="selectAll">전체선택</label>
                <input type="checkbox" id="selectAll" onClick={checkAll}/>
            </SelectAllArea>
            { !isDownloading ? 
            <DownloadButton onClick={downloadAll}>
                <FontAwesomeIcon icon={faDownload} />
                선택 다운로드
            </DownloadButton> :
            <DownloadButton onClick={downloadAll}>
                <FontAwesomeIcon icon={faSpinner} spin/>
                다운로드 중 ({progress.toFixed(2)}%)
            </DownloadButton>
            }
            
        </div>
    )
}
export default DownloadArea;