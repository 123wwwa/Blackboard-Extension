import styled from "@emotion/styled";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Todo } from "type";
import ActionIcon from "./common/ActionIcon";
import { useDispatch } from "react-redux";
import { deleteTodo } from "../../features/lecture_reducer";

const Container = styled.div<{ color: string; }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	/* min-height: 63px; */
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	
	&:hover {
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
};
// const deleteTodoItem = (item: Todo) => {
// 	const dispatch = useDispatch();
// 	return deleteTodo(dispatch as any)(item);
// };
function TodoCard({ item }: Props) {
	const [remainingTime, setRemainingTime] = useState<Date>(new Date(0));
	const [currentTime, setCurrentTime] = useState<Date>(new Date(Date.now()));
	const dispatch = useDispatch(); 
	useEffect(() => {
		setInterval(() => {
			setCurrentTime(new Date(Date.now()));
			setRemainingTime(new Date(item.date - Date.now() - 3240 * 10000));
		}, 1000);
	}, []);
	const getDayDiff = (date1: Date, date2: Date) => {
		return Math.floor((date1.getTime() - date2.getTime()) / 8.64e7);
	};
	const deleteTodoItem = (item: Todo) => {
		return deleteTodo(dispatch as any)(item);
	};
	return (
		<Container
			color={item.color}
			onClick={(e) => {
				if (!item.linkcode) return;
				// check e.target is <path> or not
				if(e.target instanceof SVGPathElement) return;
				window.open(
					`https://blackboard.unist.ac.kr/webapps/calendar/launch/attempt/${item.linkcode}`,
					"_blank"
				);
			}}
		>
			<Content>
				<Title>{item.content}</Title>
				<DateText>
					{new Date(item.date + 3240 * 10000)
						.toISOString()
						.replace("T", " ")
						.replace(/\..*/, "")}
				</DateText>
			</Content>

			<DueDateContainer>
				<DueDateText>
					{getDayDiff(new Date(item.date), currentTime)} Days
				</DueDateText>
				<DueDateText>
					{remainingTime.getHours().toString().padStart(2, "0")}:
					{remainingTime.getMinutes().toString().padStart(2, "0")}:
					{remainingTime.getSeconds().toString().padStart(2, "0")}
				</DueDateText>
			</DueDateContainer>

			<ActionIcon icon={faTrash} onClick={()=>deleteTodoItem(item)}/>
		</Container>
	);
}

export default TodoCard;
