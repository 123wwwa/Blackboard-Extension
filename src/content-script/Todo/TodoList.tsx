import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import { Todo } from "type";
import TodoCard from "./TodoCard";
import { selectAlignWith } from "../../features/lecture_reducer";
import { useSelector } from "react-redux";
import moment from "moment";

type Props = {
	todoList: Todo[];
};

const TodoListWrapper = styled.article`
	width: 100%;
	height: 330px;
	overflow: scroll;
	overflow-x: hidden;
	padding: 5px 14px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	&::-webkit-slider-thumb {
		background: #6c757d;
		border-radius: 8px;
	}
	&::-webkit-scrollbar {
		width: 7px;
		height: 10px;
		background-color: white;
		border-radius: 8px;
	}
`;

function TodoList({ todoList }: Props) {
	const [time, setTime] = useState(moment());
	const alignWith = useSelector(selectAlignWith);
	const alignWithList = useMemo(() => {
		if (alignWith === "date") {
			return todoList.slice().sort((a, b) => {
				return a.date - b.date;
			});
		} else if (alignWith === "subject") {
			return [...todoList].sort((a, b) => {
				let subjectA = a.course_name || ".";
				let subjectB = b.course_name || ".";
				return new Intl.Collator("en").compare(subjectA, subjectB);
			});
		}
	}, [todoList, alignWith]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(moment());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<TodoListWrapper>
			{alignWithList?.map((todo) => {
				return <TodoCard item={todo} time={time} />;
			})}
		</TodoListWrapper>
	);
}

export default TodoList;
