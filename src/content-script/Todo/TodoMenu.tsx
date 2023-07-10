/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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
import { reloadSetting, reloadUserEmail, selectAlarm, selectAlarmTime, selectApiKey, selectUserEmail, updateSetting } from "../../features/setting_reducer";

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
	const [showSettingMenu, setShowSettingMenu] = useState<boolean>(false);
	const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
	const isAlarmSet = useSelector(selectAlarm);
	const alarmTime = useSelector(selectAlarmTime);
	const apiKey = useSelector(selectApiKey);
	const userEmail = useSelector(selectUserEmail);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(reloadSetting as any);
		dispatch(reloadUserEmail as any);
	}, []);
	const onAlarmChange = (e: boolean) => {
		updateSetting(dispatch, "isAlarmSet", e);
	}
	const onChangeAlarmTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		// input only number and limit to 2 digits
		e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
		e.target.value = e.target.value == "" ? "0" : e.target.value;
		let convertedTime = parseInt(e.target.value);
		updateSetting(dispatch, "alarmTime", convertedTime);

	}
	const onChangeApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateSetting(dispatch, "apiKey", e.target.value);
	}
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
	const getFormattedDate = (date: Date, time: string) => {
		let day = date.getDate().toString().padStart(2, '0');
		let month = (date.getMonth() + 1).toString().padStart(2, '0');
		let year = date.getFullYear().toString();
		// Create formatted date string
		let formattedDate = `${month}/${day}/${year}%20${time}`;
		return formattedDate;
		// time start: 00:00:00 end: 23:59:59
	}
	const openMylab = () => {
		let now = new Date();
		let twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
		let startDate = getFormattedDate(now, "00:00:00");
		let endDate = getFormattedDate(twoWeeksFromNow, "23:59:59");
		let url = `https://mylab.pearson.com/api/studenthome?requestType=studenthomedata&StartDate=${startDate}&EndDate=${endDate}`;
		window.open(url, "_blank");
	}
	const logoutOauth = () => {
		window.chrome.runtime.sendMessage({ action: "logout" }, (response) => {
		});
	}
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
						<span css={styles.SettingMenuItemLabel}>{userEmail}</span>
					</Popover.Item>
					<Popover.Item
						leftIcon={<FontAwesomeIcon icon={faPowerOff} opacity="0.4" />}
					>
						<span css={styles.SettingMenuItemLabel} onClick={logoutOauth}>로그아웃</span>
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
								checked={isAlarmSet}
								onCheckedChange={onAlarmChange}
							>
								<Switch.Thumb css={styles.SwitchThumb} />
							</Switch.Root>
							<label htmlFor="alarm-label" css={styles.SwitchLabel}>
								<input onChange={onChangeAlarmTime} css={styles.TextInput} value={alarmTime} />분전
							</label>
						</div>

					</div>
					<Popover.Divider />
					<div>
					<ImageButton
						icon="public/icons/ChatGPT_logo.svg.png"
						title="Chatgpt API key"
						labelProps={{ css: styles.ImageButtonLabel }}
						imageProps={{ css: styles.ImageButtonImage }}
						css={styles.ImageButton}
					/>
					</div>
					<label htmlFor="alarm-label" css={styles.SwitchLabel}>
						<input onChange={onChangeApiKey} css={styles.TextInput2} value={apiKey} />
					</label>

					<Popover.Divider />
					<ImageButton
						icon="public/icons/icon-mylab.png"
						title="Mylab 일정 연동"
						labelProps={{ css: styles.ImageButtonLabel }}
						imageProps={{ css: styles.ImageButtonImage }}
						css={styles.ImageButton}
						onClick={openMylab}
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
