import styled from "@emotion/styled";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    pdfContent: string[][];
    numPages: number;
}
const PdfContainer = styled.div`
    width: 100%;
    height: 100%;
    .btn-wrapper {
        display: flex;
        justify-content: flex-end;
        gap: 1px;
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
    }
    .pdf-content {
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        .flex-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .page-wrapper {
                font-size: 12px;
                font-weight: bold;
            }
            .content-wrapper {
                font-size: 10px;
            }
        }
    }
`
const ContentLayout = ({ pdfContent, numPages }: Props) => {
    const calcPdfLetterCount = (pdfContent: string[][]) => {
        let letterCount = 0;
        pdfContent.forEach((page) => {
            page.forEach((content) => {
                letterCount += content.length;
            });
        });
        return letterCount;
    }
    const onClickCopy = () => {
        let text: string = "";
        Object.entries(pdfContent).map(([key, value]) => {
            text += `페이지${parseInt(key) + 1}\n`;
            value.map((content) => {
                text += `${content}\n`;
            });
        });
        navigator.clipboard.writeText(text);
    }
    return (
        <PdfContainer>
            <div className="btn-wrapper" onClick={onClickCopy}>
                <button className="copy-btn">
                    <FontAwesomeIcon icon={faCopy} />
                    <div className="letter-count">{calcPdfLetterCount(pdfContent)}자</div>
                </button>
            </div>
            <div className="pdf-content">
                <div className="flex-wrapper">
                    {Object.entries(pdfContent).map(([key, value]) => {
                        return (
                            <div>
                                <div className="page-wrapper">페이지{parseInt(key) + 1}</div>
                                <div className="content-wrapper">
                                    {value.map((content) => {
                                        return (
                                            <div>{content}</div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PdfContainer>
    );
}
export default ContentLayout;