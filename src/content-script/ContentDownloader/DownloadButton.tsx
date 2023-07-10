import JSZip from "jszip";
import { useState } from "react";
import mime from "mime-types";
const DownloadButton = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const urlToFileType = async (url: string): Promise<{ blob: Blob, fileFormat: string }> => {
        const response = await fetch(url);
        const blob = await response.blob();
        //const fileFormat = "." + blob.type.split("/")[1];
        const fileFormat = mime.extension(blob.type) ? "." + mime.extension(blob.type) : "";
        return { blob, fileFormat };
    };
    const downloadAll = async() => {
        let allLinks: NodeListOf<HTMLAnchorElement> =document.querySelectorAll('a[href*="/bbcswebdav"]');
        setIsDownloading(true);
        let zip = new JSZip();
        for (const link of allLinks) {
            const { blob, fileFormat } = await urlToFileType(link.href);
            zip.file(link.text.trim() + fileFormat, blob, { binary: true });
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
    return (
        <div>
            <button onClick={downloadAll}>{
                isDownloading ? "다운로드 중..." : "전체 다운로드"
            }</button>
        </div>
    )
}
export default DownloadButton;