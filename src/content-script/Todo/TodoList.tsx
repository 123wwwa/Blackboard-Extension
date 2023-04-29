import styled from "@emotion/styled";
import React from "react";
import { Todo } from "type";
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
	return (
		<TodoListWrapper>
			{todoList.map((todo) => {
				return (
					<TodoCard
						item={todo}
					/>
				);
			})}
		</TodoListWrapper>
	);
}

export default TodoList;
