import styled from "@emotion/styled";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DueDateText } from "../TodoCard";
import { Assignment, Lecture } from "type";
import JSZip from "jszip";
import { it } from "node:test";

const DownloadWrapper = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 8px 14px;
	filter: brightness(100%);
	border-radius: 10px;
	transition: all 0.2s ease-in-out;

	&:hover {
		filter: brightness(90%);
		background-color: ${(props) => props.color || "#F5F5F5"};
	}
`;

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 63px;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	filter: brightness(100%);
	cursor: pointer;
	transition: all 0.2s ease-in-out;

	&:hover:not(:has(${DownloadWrapper}:hover)) {
		filter: brightness(80%);
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 4px;
	flex-basis: 60%;
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 700;
	font-size: 14px;
	max-width: 300px;
	margin: 0;
`;

const Subtitle = styled.p`
	font-size: 12px;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.7);
`;

type Props = {
	item: Lecture;
	onSelect: () => void;
};

function AssignmentCard({ item, onSelect }: Props) {
	const urlToBlob = async (url: string) => {
		let blob = await fetch(url).then((r) => r.blob());
		return blob;
	};
	const downloadAllasZip = () => {
		if (!item.assignment || item.assignment.length === 0) {
			return;
		}
		const zip = new JSZip();
		item.assignment.forEach((assignment) => {
			if (assignment.fileUrl) {
				assignment.fileUrl.forEach((fileUrl) => {
					zip.file(fileUrl.fileName, urlToBlob(fileUrl.fileURL));
				});
			}
			if (assignment.Assignment_Files) {
				assignment.Assignment_Files.forEach((file) => {
					zip.file(file.fileName, urlToBlob(file.fileURL));
				});
			}
		});
		zip.generateAsync({ type: "blob" }).then((content) => {
			const a = document.createElement("a");
			const url = URL.createObjectURL(content);
			a.href = url;
			a.download = `${item.name}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		});
	};
	return (
		<Container color={item.color} onClick={onSelect}>
			<Content>
				<Title>{item.name}</Title>
				<Subtitle>제출한 과제: {item.assignment.length}</Subtitle>
			</Content>
			<DownloadWrapper
				color={item.color}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<DueDateText onClick={downloadAllasZip}>전체 다운로드</DueDateText>
				<FontAwesomeIcon icon={faDownload} opacity={0.4} />
			</DownloadWrapper>
		</Container>
	);
}

export default AssignmentCard;
