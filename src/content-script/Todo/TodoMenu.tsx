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
	faPowerOff,
	faRefresh,
	faUserCircle,
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
import ImageButton from "./common/ImageButton";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { css } from "@emotion/react";
import * as Switch from "@radix-ui/react-switch";

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
};

type Props = {
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	tab: (typeof TodoTabs)[number];
};

function TodoMenu({ setShow, tab }: Props): JSX.Element {
	const [showSettingMenu, setShowSettingMenu] = useState<boolean>(false);
	const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
	const [alarm, setAlarm] = useState<boolean>(false);

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
			<Popover open={showSettingMenu} onOpenChange={setShowSettingMenu}>
				<Popover.Target>
					<ActionIcon icon={faGear} />
				</Popover.Target>
				<Popover.Content css={styles.SettingMenu}>
					<p>구글 캘린더 설정</p>
					<Popover.Divider />
					<Popover.Item
						leftIcon={<FontAwesomeIcon icon={faUserCircle} opacity="0.4" />}
					>
						<span css={styles.SettingMenuItemLabel}>hyweare@gmail.com</span>
					</Popover.Item>
					<Popover.Item
						leftIcon={<FontAwesomeIcon icon={faPowerOff} opacity="0.4" />}
					>
						<span css={styles.SettingMenuItemLabel}>로그아웃</span>
					</Popover.Item>
					<div css={styles.NotificationItemContainer}>
						<Popover.Item
							leftIcon={<FontAwesomeIcon icon={faBell} opacity="0.4" />}
						>
							<span css={styles.SettingMenuItemLabel}>알림</span>
						</Popover.Item>
						<div css={styles.SwitchContainer}>
							<Switch.Root
								id="alarm-label"
								css={styles.SwitchRoot}
								checked={alarm}
								onCheckedChange={setAlarm}
							>
								<Switch.Thumb css={styles.SwitchThumb} />
							</Switch.Root>
							<label htmlFor="alarm-label" css={styles.SwitchLabel}>
								30분 전
							</label>
						</div>
					</div>
					<Popover.Divider />
					<ImageButton
						icon="public/icons/icon-mylab.png"
						title="Mylab 일정 연동"
						labelProps={{ css: styles.ImageButtonLabel }}
						imageProps={{ css: styles.ImageButtonImage }}
						css={styles.ImageButton}
					/>
				</Popover.Content>
			</Popover>
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
