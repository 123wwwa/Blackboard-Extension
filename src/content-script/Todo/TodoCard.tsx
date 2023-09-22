import styled from "@emotion/styled";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Todo } from "type";
import ActionIcon, { ActionIconContainer } from "./common/ActionIcon";
import { useDispatch } from "react-redux";
import { deleteTodo } from "../../features/lecture_reducer";
import moment from "moment";

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	filter: brightness(100%);
	transition: all 0.2s ease-in-out;

	${ActionIconContainer} {
		padding: 16px;
		filter: brightness(80%);
	}
	${ActionIconContainer}:hover {
		background-color: ${(props) => props.color || "#F5F5F5"};
	}

	&:hover:not(:has(${ActionIconContainer}:hover)) {
		filter: brightness(80%);
		cursor: pointer;
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
	item: Todo;
	time: moment.Moment;
};
// const deleteTodoItem = (item: Todo) => {
// 	const dispatch = useDispatch();
// 	return deleteTodo(dispatch as any)(item);
// };
function TodoCard({ item, time }: Props) {
	const dispatch = useDispatch();
	const deleteTodoItem = (item: Todo) => {
		return deleteTodo(dispatch as any)(item);
	};
	const diff = moment(item.date).diff(time);
	return (
		<Container
			color={item.color}
			onClick={(e) => {
				if (!item.linkcode) return;
				let parent = document.querySelector("#deleteTodo") as HTMLElement;
				if (parent.contains(e.target as Node)) return;
				if(item.linkcode.includes("https://") || item.linkcode.includes("http://")) {
					window.open(item.linkcode, "_blank");
					return;
				}
				window.open(
					`https://blackboard.unist.ac.kr/webapps/calendar/launch/attempt/${item.linkcode}`,
					"_blank"
				);
			}}
		>
			<Content>
				<Title>{item.content}</Title>
				<DateText>{moment(item.date).format("YYYY-MM-DD HH:mm:ss")}</DateText>
			</Content>

			<DueDateContainer>
				{diff >= 0 ? (
					<>
						<DueDateText>
							{Math.floor(moment.duration(diff).asDays())} Days
						</DueDateText>
						<DueDateText>{moment.utc(diff).format("HH:mm:ss")}</DueDateText>
					</>
				) : (
					<>
						<DueDateText>Due Date</DueDateText>
						<DueDateText>Exceeded</DueDateText>
					</>
				)}
			</DueDateContainer>

			<ActionIcon icon={faTrash} onClick={() => deleteTodoItem(item)} id="deleteTodo" />
		</Container>
	);
}

export default TodoCard;
