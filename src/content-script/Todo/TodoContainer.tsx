import ImageButton from "./common/ImageButton";
import TodoMenu from "./TodoMenu";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	reloadLectureList,
	reloadTodoList,
	selectTodoList,
} from "../../features/lecture_reducer";
import TodoList from "./TodoList";
import TodoFooter from "./TodoFooter";
type Props = {
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const Container = styled.div<{ show: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
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

		.box {
			display: flex;
			align-items: center;
			gap: 33px;

			.tabs {
				display: flex;
				align-items: center;
				color: rgba(0, 0, 0, 0.5);
				font-size: 14px;
				gap: 23px;

				p {
					cursor: pointer;

					&.active {
						border-bottom: 1px solid rgba(0, 0, 0, 0.7);
					}
				}
			}
		}
	}
`;

const TodoTabs = ["과제", "다운로드"];

function TodoContainer({ show, setShow }: Props) {
	const [color, setColor] = useState("#E5E5E5");
	const [tab, setTab] = useState("과제");
	const todoList = useSelector(selectTodoList);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(reloadLectureList as any);
	}, [dispatch]);
	//const [todoList, setTodoList] = useLocalStorage
	return (
		<Container show={show}>
			<header>
				<div className="box">
					<ImageButton
						title="구글 연동"
						icon={chrome.runtime.getURL(
							"public/icons/icon-google-calendar.png"
						)}
					/>
					<div className="tabs">
						{TodoTabs.map((tabName) => (
							<p
								key={tabName}
								className={`${tab === tabName ? "active" : ""}`}
								onClick={() => setTab(tabName)}
							>
								{tabName}
							</p>
						))}
					</div>
				</div>
				<TodoMenu setShow={setShow} />
			</header>
			{tab === "과제" ? (
				// 과제 탭
				<>
					<TodoList todoList={todoList} />
					<TodoFooter color={color} setColor={setColor} />
				</>
			) : (
				// 다운로드 탭
				<> </>
			)}
		</Container>
	);
}

export default TodoContainer;
