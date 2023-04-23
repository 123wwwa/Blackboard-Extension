import IconButton from "./common/IconButton";
import TodoMenu from "./TodoMenu";
import TodoCard from "./TodoCard";
import ActionIcon from "./common/ActionIcon";
import TextInput from "./common/TextInput";
import DatePicker from "./common/DatePicker";
import styled from "@emotion/styled";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { css } from "@emotion/react";
import SketchPicker from "react-color/lib/components/sketch/Sketch";

type Props = {
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const Container = styled.div<{ show: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 512px;
	height: 431px;
	background-color: #ffffff;
	border: 2px solid #dedede;
	border-radius: 10px;
	transition: opacity 300ms linear, visibility 0s linear 300ms;
	box-sizing: border-box;
	box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14);
	opacity: ${(props) => (props.show ? 1 : 0)};
	visibility: ${(props) => (props.show ? "visible" : "hidden")};
	${(props) => props.show && "transition-delay: 0s;"}

	header {
		display: flex;
		width: 100%;
		padding-left: 16px;
		padding-right: 14px;
		padding-top: 13px;
		padding-bottom: 9.83px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	article {
		width: 100%;
		height: 330px;
		overflow: scroll;
		padding: 5px 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px 14px;

		.menus {
			display: flex;
			align-items: center;
			gap: 5px;
		}
	}
`;

function TodoContainer({ show, setShow }: Props) {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [color, setColor] = useState("#E5E5E5");

	return (
		<Container show={show}>
			<header>
				<IconButton
					title="구글 연동"
					icon={chrome.runtime.getURL("public/icons/icon-google-calendar.png")}
				/>
				<TodoMenu setShow={setShow} />
			</header>
			<article>
				<TodoCard color="#E5E5E5" />
				<TodoCard color="#FECACA" />
				<TodoCard color="#FDE68A" />
				<TodoCard color="#A5F3FC" />
				<TodoCard color="#E5E5E5" />
				<TodoCard color="#FECACA" />
				<TodoCard color="#FDE68A" />
				<TodoCard color="#A5F3FC" />
				<TodoCard color="#E5E5E5" />
				<TodoCard color="#FECACA" />
				<TodoCard color="#FDE68A" />
				<TodoCard color="#A5F3FC" />
			</article>
			<footer>
				<div className="menus">
					{showColorPicker && (
						<div css={css({ position: "absolute", zIndex: 10 })}>
							<div
								css={css({
									position: "fixed",
									left: 0,
									right: 0,
									top: 0,
									bottom: 0,
								})}
								onClick={() => setShowColorPicker(false)}
							></div>
							<SketchPicker
								color={color}
								onChange={(color) => setColor(color.hex)}
							/>
						</div>
					)}
					<ActionIcon
						size="24px"
						icon={chrome.runtime.getURL("public/icons/icon-palette.png")}
						onClick={() => setShowColorPicker((show) => !show)}
					/>
					<TextInput placeholder="새 일정 이름 입력" />
					<DatePicker />
				</div>
				<ActionIcon
					size="24px"
					icon={chrome.runtime.getURL("public/icons/icon-plus.png")}
				/>
			</footer>
		</Container>
	);
}

export default TodoContainer;
