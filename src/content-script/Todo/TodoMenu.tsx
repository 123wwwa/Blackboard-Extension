import React, { useState } from "react";
import ActionIcon from "./common/ActionIcon";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faBook,
	faClock,
	faClose,
	faGear,
	faHamburger,
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { reloadTodoList, resetTodoList } from "../../features/lecture_reducer";
import Menu from "./common/Menu";

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
	const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
	const dispatch = useDispatch();
	const refreshTodo = () => {
		dispatch(resetTodoList as any);
	};

	return (
		<Container>
			<ActionIcon icon={faRefresh} onClick={refreshTodo} />
			<ActionIcon icon={faGear} />
			<Menu show={showSortMenu} onChange={setShowSortMenu}>
				<Menu.Target>
					<ActionIcon icon={faBars} />
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.MenuItem
						leftIcon={<FontAwesomeIcon icon={faClock} opacity={0.4} />}
					>
						날짜별 정렬
					</Menu.MenuItem>
					<Menu.MenuItem
						leftIcon={<FontAwesomeIcon icon={faBook} opacity={0.4} />}
					>
						과목별 정렬
					</Menu.MenuItem>
				</Menu.Dropdown>
			</Menu>
			<ActionIcon icon={faClose} onClick={() => setShow((show) => !show)} />
		</Container>
	);
}

export default TodoMenu;
