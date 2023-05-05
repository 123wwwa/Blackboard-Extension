import styled from "@emotion/styled";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Assignment, Todo } from "type";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "../common/Checkbox";

const DownloadWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 4px 2px;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		background-color: rgba(28, 25, 23, 0.35);
	}
`;

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 16px;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
`;

const InnerContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
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

const DueDateContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const DateText = styled.p`
	font-size: 12px;
	font-weight: 400;
`;

export const DueDateText = styled(DateText)`
	color: #dc2626;
`;
type Props = {
	item?: Assignment;
};
// const deleteTodoItem = (item: Todo) => {
// 	const dispatch = useDispatch();
// 	return deleteTodo(dispatch as any)(item);
// };
function DownloadCard({ item }: Props) {
	return (
		<Container color={"#E9E9E9"}>
			<Checkbox />
			<InnerContainer>
				<Content>
					<Title>{item?.Name || "System Programming: Assignment 3"}</Title>
					<DateText>2023-04-04 23:59</DateText>
				</Content>

				<DownloadWrapper>
					<DueDateText>과제 파일</DueDateText>
					<FontAwesomeIcon icon={faDownload} opacity={0.4} />
				</DownloadWrapper>
			</InnerContainer>
		</Container>
	);
}

export default DownloadCard;
