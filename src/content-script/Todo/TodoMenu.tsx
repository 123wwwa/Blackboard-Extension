import React from "react";
import ActionIcon from "./common/ActionIcon";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faClose,
	faGear,
	faHamburger,
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { reloadTodoList, resetTodoList } from "../../features/lecture_reducer";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
`;

type Props = {
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

function TodoMenu({ setShow }: Props): JSX.Element {
	const dispatch = useDispatch(); 
	const refreshTodo = () => {
		dispatch(resetTodoList as any);
	};

	return (
		<Container>
			<ActionIcon icon={faRefresh} onClick={refreshTodo}/>
			<ActionIcon icon={faGear} />
			<ActionIcon icon={faBars} />
			<ActionIcon icon={faClose} onClick={() => setShow((show) => !show)} />
		</Container>
	);
}

export default TodoMenu;
