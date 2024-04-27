import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import type { Todo } from "~shared/types/blackboardTypes";
import useUserStateStore from "~shared/stores/userStateStore";
import TodoCard from "./TodoCard";

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
	const { alignWith } = useUserStateStore();
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
			{alignWithList?.map((todo, index) => {
				return (<div key={index}>
					<TodoCard item={todo} time={time} />
				</div>);
			})}
		</TodoListWrapper>
	);
}

export default TodoList;
