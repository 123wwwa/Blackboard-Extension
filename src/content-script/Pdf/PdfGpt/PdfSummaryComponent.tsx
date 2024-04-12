import styled from "@emotion/styled";
import { summarizePDF } from "../../../features/chatgpt";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faDownload, faFloppyDisk, faRotateRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
type Props = {
    pdfUrl: string;
    pdfTitle : string;
    summary: string;
    setSummary: React.Dispatch<React.SetStateAction<string>>;
}
export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 0px;
    button {
        background-color: #f0f0f0;
        border: none;
        border-radius: 5px;
        padding: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
            filter: brightness(90%);
        }
    }
    .letter-count {
        font-size: 12px;
        font-weight: 700;
    }
`;
export const SummaryTab = styled.div`
    font-size: 16px;
    font-weight: 700;
    width: 100%;
    height: 100%;
    .summary-content {
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        .summary-container {
            display: flex;
            flex-direction: column;
            p, ul, li { 
                font-size: 12px;
                font-weight: 700;
                line-height: 2;
                margin-bottom: 2;
            }
            li {
                font-size: 10px;
                font-weight: 400;
                line-height: 1;
                margin-bottom: 0;
            }
        }
    }
`;
export const PdfSummaryComponent = ({ pdfTitle, pdfUrl, summary, setSummary }: Props) => {
    if (summary === "") {
        return <SummaryTab>요약 중<FontAwesomeIcon icon={faSpinner} spin /></SummaryTab>
    }
    const reloadSummary = async () => {
        setSummary("");
        let res = await summarizePDF(pdfUrl);
        setSummary(res);
    }
    const copySummary = () => {
        navigator.clipboard.writeText(summary);
    }
    return (
        <SummaryTab>
            <ButtonWrapper>
                <button className="download-btn">
                    <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(summary)}`} download={`summary-${pdfTitle}.md`}>
                        <FontAwesomeIcon icon={faDownload} />
                    </a>
                </button>
                <button className="save-btn">
                    <FontAwesomeIcon icon={faFloppyDisk}/>
                    <div className="letter-count">저장</div>
                </button>
                <button className="copy-btn" onClick={copySummary}>
                    <FontAwesomeIcon icon={faCopy} />
                    <div className="letter-count">{summary.length}자</div>
                </button>
                <button className = "reload-btn" onClick={reloadSummary}>
                    <FontAwesomeIcon icon={faRotateRight}/>
                </button>
            </ButtonWrapper>
            <div className="summary-content">
                <ReactMarkdown className="summary-container">{summary}</ReactMarkdown>
            </div>
        </SummaryTab>
    )
}