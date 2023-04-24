import ImageButton from "./common/ImageButton";
import TodoMenu from "./TodoMenu";
import TodoCard from "./TodoCard";
import ActionIcon from "./common/ActionIcon";
import TextInput from "./common/TextInput";
import DatePicker from "./common/DatePicker";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { css } from "@emotion/react";
import SketchPicker from "react-color/lib/components/sketch/Sketch";
import { useDispatch, useSelector } from "react-redux";
import {
	reloadLectureList,
	reloadTodoList,
	selectTodoList,
} from "../../features/lecture_reducer";
import { faPalette, faPlus } from "@fortawesome/free-solid-svg-icons";
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
	display: ${(props) => (props.show ? "flex" : "none")};

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
		overflow-x: hidden;
		padding: 5px 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		&::-webkit-slider-thumb {
			background: #6c757d;
			border-radius: 8px;
		}
		&::-webkit-scrollbar {
			width: 7px;
			height: 10px;
			background-color: white;
			border-radius: 8px;
		}
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
	const todoList = useSelector(selectTodoList);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(reloadLectureList as any);
	}, [dispatch]);
	//const [todoList, setTodoList] = useLocalStorage
	return (
		<Container show={show}>
			<header>
				<ImageButton
					title="구글 연동"
					icon={chrome.runtime.getURL("public/icons/icon-google-calendar.png")}
				/>
				<TodoMenu setShow={setShow} />
			</header>
			<article>
				{todoList.map((todo) => {
					return (
						<TodoCard
							color={todo.color}
							content={todo.content}
							course_name={todo.course_name}
							date={todo.date}
							linkcode={todo.linkcode}
						/>
					);
				})}
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
						icon={faPalette}
						onClick={() => setShowColorPicker((show) => !show)}
					/>
					<TextInput placeholder="새 일정 이름 입력" />
					<DatePicker />
				</div>
				<ActionIcon icon={faPlus} />
			</footer>
		</Container>
	);
}

export default TodoContainer;
