/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faBook,
	faClock,
	faClose,
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/react";
import type { TodoTabs } from "../MainContainer";
import ActionIcon from "~components/common/ActionIcon";
import { reloadSetting, reloadUserEmail } from "~features/events/settingUtils";
import { resetDeletedTodoList } from "~features/events/todoListUtils";
import { updateAlarmList } from "~features/events/alarms/alarmListUtils";
import { setAlignWith, type AlignWith } from "~shared/stores/userStateStore";
import { SettingMenu } from "./SettingMenu";
import Popover from "~components/common/Popover";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
`;

export const styles = {
	SettingMenu: css({
		fontSize: "12px",
	}),

	SettingMenuItemLabel: css({
		fontSize: "12px",
	}),

	ImageButton: css({
		width: "100%",
		border: "none",
		padding: "7px",
		"&:focus": {
			border: "none",
		},
	}),

	ImageButtonLabel: css({
		fontSize: "12px",
		fontWeight: 400,
		color: "black",
	}),

	ImageButtonImage: css({
		width: "16px",
		height: "16px",
	}),

	NotificationItemContainer: css({
		display: "flex",
		alignItems: "center",
		gap: "20px",
	}),

	SwitchContainer: css({
		display: "flex",
		alignItems: "center",
		gap: "6px",
	}),

	SwitchLabel: css({
		width: "max-content",
	}),

	SwitchRoot: css({
		all: "unset",
		width: "24px",
		height: "14px",
		borderRadius: "9999px",
		position: "relative",
		backgroundColor: "darkgray",
		WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
		"&:focus": { boxShadow: `0 0 0 2px black` },
		'&[data-state="checked"]': { backgroundColor: "#3073d1" },
	}),

	SwitchThumb: css({
		display: "block",
		width: "10px",
		height: "10px",
		backgroundColor: "white",
		borderRadius: "9999px",
		transition: "transform 100ms",
		transform: "translateX(2px)",
		willChange: "transform",
		'&[data-state="checked"]': { transform: "translateX(12px)" },
	}),
	TextInput: css({
		width: "28px",
		border: "0.5px solid #d9d9d9",
		fontSize: "12px",
		borderRadius: "4px",
		padding: "2px",
		"&:focus": {
			border: "none",
		},
	}),
	TextInput2: css({
		width: "120px",
		border: "0.5px solid #d9d9d9",
		borderRadius: "4px",
		padding: "2px",
		"&:focus": {
			border: "none",
		},
	}),
};

type Props = {
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	tab: (typeof TodoTabs)[number];
};

function TodoMenu({ setShow, tab }: Props): JSX.Element {
	const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
	useEffect(() => {
		reloadSetting();
		reloadUserEmail();
	}, []);

	const refreshTodo = () => {
		if (tab == "과제") {
			resetDeletedTodoList();
		} else if (tab == "알림") {
			updateAlarmList();
		}
	};
	const alignWith = (type: AlignWith) => {
		if (tab == "과제") {
			setAlignWith(type);
		}
	};
	const handleSortMenu = (open: boolean) => {
		if (tab == "과제") {
			setShowSortMenu(open);
		}
	};
	return (
		<Container>
			{tab !== "다운로드" && (
				<ActionIcon icon={faRefresh} onClick={refreshTodo} />
			)}
			<SettingMenu/>
			<Popover open={showSortMenu} onOpenChange={handleSortMenu}>
				<Popover.Target>
					<ActionIcon icon={faBars} />
				</Popover.Target>
				<Popover.Content>
					<Popover.Item
						onClick={() => {
							alignWith("date");
						}}
						leftIcon={<FontAwesomeIcon icon={faClock} opacity={0.4} />}
					>
						날짜별 정렬
					</Popover.Item>
					<Popover.Item
						onClick={() => {
							alignWith("subject");
						}}
						leftIcon={<FontAwesomeIcon icon={faBook} opacity={0.4} />}
					>
						과목별 정렬
					</Popover.Item>
				</Popover.Content>
			</Popover>
			<ActionIcon icon={faClose} onClick={() => setShow((show) => !show)} />
		</Container>
	);
}

export default TodoMenu;
