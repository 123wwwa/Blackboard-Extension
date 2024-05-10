import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowRight, faList, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import ContentLayout from "./content/ContentLayout";
import SummaryLayout from "./summary/SummaryLayout";
import SaveLayout from "./save/SaveLayout";
import { summarizePDF } from "~features/events/chatgpt";
import { pdfToTextList } from "~features/events/pdfExtractor";


type Props = {
    pdfUrl: string;
    pdfTitle: string;
}
const Container = styled.header<{ isOpen: boolean }>`
    width: 300px;
    padding: 10px;
    margin-right: 10px;
    border-radius: 10px;
    border: 1px solid #dedede;
    transition: left 0.8s ease;
    ${({ isOpen }) => !isOpen && css`
        position: fixed;
        left: -300px;
    `};
`;
export const ContentTab = styled.button`
    width: 100%;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 5px;
`;
const TabListText = styled.p`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: 700;
    font-size: 16px;
`;
export const PdfTabs = ["내용", "요약", "저장"] as const;
export const DrawerContainer = styled.div<{ isOpen: boolean }>`
    display: flex;
    flex-direction: row;
    height: 100%;
    button {
        transform: translateX(-15px);
        border: none;
        border-radius: 5px;
        padding: 20px 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
            background-color: #f0f0f0;
        }
    }
    .drawer-button {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
export const ContentTabs = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    p {
        cursor: pointer;
        position: relative;
        border-radius: 32px;
        padding: 5px 7px;
        background-color: white;
        transition: all 0.2s ease-in-out;
        &.active {
            background-color: #f8f8f8;
        }
        &:hover {
            filter: brightness(90%);
        }
    }
`;
export type PdfContent = {
    text: string[];
    numPages: number;
}
const PdfGptContainer = ({ pdfUrl, pdfTitle }: Props) => {
    const [iframeHeight, setIframeHeight] = useState<number>(700);
    const [pdfContent, setPdfContent] = useState<PdfContent>({ text: [], numPages: 0 });
    const getInitialShowContainer = () => {
        const saved = localStorage.getItem('showContainer');
        return saved ? JSON.parse(saved) : true;
    };
    useEffect(() => {
        const iframe = document.querySelector('iframe[src*="bbcswebdav"]') as HTMLIFrameElement;
        setIframeHeight(iframe.clientHeight);
        pdfToTextList(pdfUrl).then((res) => {
            setPdfContent(res);
        });
    }, []);
    const [showContainer, setShowContainer] = useState<boolean>(getInitialShowContainer());
    useEffect(() => {
        localStorage.setItem('showContainer', JSON.stringify(showContainer));
    }, [showContainer]);
    const [tab, setTab] = useState<(typeof PdfTabs)[number]>("내용");
    const [summary, setSummary] = useState<string>("");
    const TabListComponent = (tab: any) => {
        switch (tab.tab) {
            case "내용":
                return <ContentLayout pdfContent={pdfContent} />;
            case "요약":
                return null;
            case "저장":
                return <SaveLayout pdfContent={pdfContent} />;
            default:
                return <SummaryLayout pdfContent={pdfContent} pdfTitle={pdfTitle} summary={summary} setSummary={setSummary} />;
        }
    };
    const ContentTabIcon = (tab: any) => {
        switch (tab) {
            case "내용":
                return <FontAwesomeIcon icon={faFileLines} opacity={0.5} />;
            case "요약":
                return <FontAwesomeIcon icon={faList} opacity={0.5} />;
            case "저장":
                return <FontAwesomeIcon icon={faNoteSticky} opacity={0.5} />;
        }
    }
    const onClickSetTab = (tabName: any) => {
        setTab(tabName);
        if (tabName === "요약" && summary === "") {
            summarizePDF(pdfContent).then((res) => {
                setSummary(res);
            });
        }
    }
    const onClickDrawerButton = () => {
        setShowContainer(!showContainer);
    }
    return (
        <DrawerContainer isOpen={showContainer}>
            <div className="drawer-button">
                <button onClick={onClickDrawerButton}>
                    {showContainer ?
                        <FontAwesomeIcon icon={faArrowLeft} /> :
                        <FontAwesomeIcon icon={faArrowRight} />}
                </button>
            </div>
            <Container isOpen={showContainer} style={{ height: iframeHeight + "px" }}>
                <ContentTabs>
                    {PdfTabs.map((tabName) => (
                        <TabListText key={tabName} onClick={() => onClickSetTab(tabName)} className={tab === tabName ? "active" : ""}>
                            {ContentTabIcon(tabName)} {tabName}
                        </TabListText>
                    ))}
                </ContentTabs>
                <div style={{
                    height: iframeHeight * 0.9 + "px",
                    width: "100%",
                }}>
                    <TabListComponent tab={tab} />
                </div>
            </Container>
        </DrawerContainer>
    );
}
export default PdfGptContainer;