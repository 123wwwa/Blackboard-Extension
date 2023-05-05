import styled from "@emotion/styled";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DueDateText } from "../TodoCard";

const DownloadWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 4px 2px;

	&:hover {
		border-radius: 5px;
		background-color: rgba(28, 25, 23, 0.35);
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
	cursor: pointer;

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
	name: string;
	count: number;
	color: string;
	onSelect: () => void;
};

function AssignmentCard({ name, count, color, onSelect }: Props) {
	return (
		<Container color={color} onClick={onSelect}>
			<Content>
				<Title>{name}</Title>
				<Subtitle>제출한 과제: {count}</Subtitle>
			</Content>
			<DownloadWrapper
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<DueDateText>전체 다운로드</DueDateText>
				<FontAwesomeIcon icon={faDownload} opacity={0.4} />
			</DownloadWrapper>
		</Container>
	);
}

export default AssignmentCard;
