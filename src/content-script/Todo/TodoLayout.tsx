import { selectTodoList } from "../../features/lecture_reducer";
import { useState } from "react";
import { useSelector } from "react-redux";
import TodoFooter from "./TodoFooter";
import TodoList from "./TodoList";

function TodoLayout() {
	const [color, setColor] = useState("#E5E5E5");
	const todoList = useSelector(selectTodoList);

	return (
		<>
			<TodoList todoList={todoList} />
			<TodoFooter color={color} setColor={setColor} />
		</>
	);
}

export default TodoLayout;
