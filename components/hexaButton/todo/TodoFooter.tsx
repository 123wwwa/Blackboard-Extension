/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {  faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import ActionIcon from "~components/common/ActionIcon";
import SketchColorPicker from "~components/common/ColorPicker";
import DatePicker from "~components/common/DatePicker";
import LinkField from "~components/common/LinkFleid";
import TextInput from "~components/common/TextInput";
import { addTodoItem } from "~features/events/todoListUtils";
import type { Todo } from "~shared/types/blackboardTypes";


type Props = {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
};

const TodoFooterWrapper = styled.footer`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 10px 14px;
	gap: 10px;

	.menus {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 5px;
	}
`;

const styles = {
	TextWrapper: css({
		flex: 1,

		"&::after": {
			content: "''",
			position: "absolute",
			bottom: 0,
			left: 0,
			width: "100%",
			height: "0.5px",
			backgroundColor: "rgb(67, 67, 67, 0.7)",
			transform: "scaleX(0)",
			transition: "all 0.2s ease-in",
		},

		"&:focus-within::after": {
			transform: "scaleX(1)",
		},
	}),
	TextInput: css({
		width: "100%",
		border: "none",
		borderBottom: "1px solid #dedede",
		borderRadius: 0,
		paddingLeft: 0,
		position: "relative",
	}),
	DatePicker: css({
		width: "fit-content",
	}),
};

function TodoFooter({ color, setColor }: Props) {
	const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
	const [title, setTitle] = React.useState<string>("");
	const [link, setLink] = React.useState<string>("");
	const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};
	const onChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLink(e.target.value);
	};
	const onClickAdd = () => {
		if (currentDate < new Date() || !title.trim()) return;
		
		const todo: Todo = {
			content: title,
			color: color,
			date: +currentDate,
			linkcode: link,
			userCreated: true,
		};
		addTodoItem(todo);
		setTitle("");
		setColor("#F5F5F5");
		setLink("");
		setCurrentDate(new Date());
	};

	return (
		<TodoFooterWrapper>
			<div className="menus">
				<SketchColorPicker color={color} setColor={setColor} />
				<TextInput
					placeholder="새 일정 이름 입력"
					value={title}
					onChange={onChangeTitle}
					wrapperProps={{ css: styles.TextWrapper }}
					css={styles.TextInput}
				/>
				<div>
					<DatePicker
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
						css={styles.DatePicker}
					/>
				</div>
				<LinkField 
					onChange={onChangeLink} 
					value={link}
					placeholder="링크 입력"
				/>
			</div>
			<ActionIcon icon={faPlus} onClick={onClickAdd} />
		</TodoFooterWrapper>
	);
}

export default TodoFooter;
