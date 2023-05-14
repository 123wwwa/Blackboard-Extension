import styled from "@emotion/styled";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Todo } from "type";
import ActionIcon from "./common/ActionIcon";
import { useDispatch } from "react-redux";
import { deleteTodo } from "../../features/lecture_reducer";
import moment from "moment";

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	/* min-height: 63px; */
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	filter: brightness(100%);
	transition: all 0.2s ease-in-out;

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
	const dispatch = useDispatch();
	const [timer, setTimer] = useState<moment.Duration>(
		moment.duration(moment(item.date).diff(Date.now()))
	);
	useEffect(() => {
		const intervalFn = setInterval(() => {
			setTimer(moment.duration(moment(item.date).diff(Date.now())));
		}, 1000);
		return () => {
			clearInterval(intervalFn);
		};
	}, []);
	const deleteTodoItem = (item: Todo) => {
		return deleteTodo(dispatch as any)(item);
	};
	return (
		<Container
			color={item.color}
			onClick={(e) => {
				if (!item.linkcode) return;
				// check e.target is <path> or not
				if (e.target instanceof SVGPathElement) return;
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
				{timer.asMilliseconds() >= 0 ? (
					<>
						<DueDateText>{timer.days()} Days</DueDateText>
						<DueDateText>
							{timer.hours().toString().padStart(2, "0")}:
							{timer.minutes().toString().padStart(2, "0")}:
							{timer.seconds().toString().padStart(2, "0")}
						</DueDateText>
					</>
				) : (
					<>
						<DueDateText>Due Date</DueDateText>
						<DueDateText>Exceeded</DueDateText>
					</>
				)}
			</DueDateContainer>

			<ActionIcon icon={faTrash} onClick={() => deleteTodoItem(item)} />
		</Container>
	);
}

export default TodoCard;
