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
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import {
	reloadBB_alarms,
	reloadTodoList,
	resetTodoList,
	setAlignWith,
} from "../../features/lecture_reducer";
import Popover from "./common/Popover";
import { TodoTabs } from "./TodoContainer";
import { AlignWith } from "type";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
`;

type Props = {
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	tab: (typeof TodoTabs)[number];
};

function TodoMenu({ setShow, tab }: Props): JSX.Element {
	const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
	const dispatch = useDispatch();
	const refreshTodo = () => {
		if (tab == "과제") {
			dispatch(resetTodoList as any);
		} else if (tab == "알림") {
			dispatch(reloadBB_alarms as any);
		}
	};
	const alignWith = (type: AlignWith) => {
		if (tab == "과제") {
			dispatch(setAlignWith(type) as any);
		}
	};
	const handleSortMenu = (e: any) => {
		if (tab == "과제") {
			setShowSortMenu(e);
		}
	};
	return (
		<Container>
			{tab !== "다운로드" && (
				<ActionIcon icon={faRefresh} onClick={refreshTodo} />
			)}
			<ActionIcon icon={faGear} />
			<Popover open={showSortMenu} onOpenChange={setShowSortMenu}>
				<Popover.Target>
					<ActionIcon icon={faBars} />
				</Popover.Target>
				<Popover.Content>
					<Popover.Item
						leftIcon={<FontAwesomeIcon icon={faClock} opacity={0.4} />}
					>
						날짜별 정렬
					</Popover.Item>
					<Popover.Item
						leftIcon={<FontAwesomeIcon icon={faBook} opacity={0.4} />}
					>
						과목별 정렬
					</Popover.Item>
				</Popover.Content>
			</Popover>
			{/* <Menu show={showSortMenu} onChange={setShowSortMenu}>
				<Menu.Target>
					<ActionIcon icon={faBars}/>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.MenuItem
						onClick={() => { alignWith("date") }}
						leftIcon={<FontAwesomeIcon icon={faClock} opacity={0.4} />}
					>
						날짜별 정렬
					</Menu.MenuItem>
					<Menu.MenuItem
						onClick={() => { alignWith("subject") }}
						leftIcon={<FontAwesomeIcon icon={faBook} opacity={0.4} />}
					>
						과목별 정렬
					</Menu.MenuItem>
				</Menu.Dropdown>
			</Menu> */}
			<ActionIcon icon={faClose} onClick={() => setShow((show) => !show)} />
		</Container>
	);
}

export default TodoMenu;
