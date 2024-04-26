import { useState } from "react";
import TodoFooter from "./TodoFooter";
import TodoList from "./TodoList";
import useLectureStore from "~shared/stores/lectureStore";

function TodoLayout() {
	const [color, setColor] = useState("#E5E5E5");
	const {todoList} = useLectureStore();

	return (
		<>
			<TodoList todoList={todoList} />
			<TodoFooter color={color} setColor={setColor} />
		</>
	);
}

export default TodoLayout;
