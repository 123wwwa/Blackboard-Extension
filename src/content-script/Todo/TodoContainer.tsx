import ImageButton, { ImageButtonContainer } from "./common/ImageButton";
import TodoMenu from "./TodoMenu";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postTodoList, reloadTodoList, selectTodoList } from "../../features/lecture_reducer";
import AlarmList from "./Alarm/AlarmList";
import TodoLayout from "./TodoLayout";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AssignmentLayout from "./Assignment/AssignmentLayout";
import AlarmLayout from "./Alarm/AlarmLayout";
import ActionIcon from "./common/ActionIcon";

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
				color: rgba(0, 0, 0, 0.4);
				font-size: 14px;
				font-weight: 700;
				gap: 8px;

				p {
					cursor: pointer;
					position: relative;
					border-radius: 32px;
					padding: 5px 12px;
					background-color: white;
					transition: all 0.2s ease-in-out;
					filter: brightness(100%);
					
					&.active {
						background-color: #F8F8F8;
					}

					&:hover {
						filter: brightness(90%);
					}
				}
			}
		}
	}
`;

const TodoTabs = ["과제", "다운로드", "알림"];

function TodoContainer({ show, setShow }: Props) {
	const [tab, setTab] = useState("과제");
	const todoList = useSelector(selectTodoList);
	const [googleCalendarIcon, setGoogleCalendarIcon] = useState(chrome.runtime.getURL("public/icons/icon-google-calendar.png"));
	const [isUpdated, setIsUpdated] = useState(true);
	const dispatch = useDispatch();
	const postTodoLists = () => {
		setIsUpdated(false);
		postTodoList(todoList);
	}
	useEffect(() => {
		dispatch(reloadTodoList as any);
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action === "calendarUpdateDone") {
				setIsUpdated(true);
			}
		}
		);
	}, [dispatch]);

	const TabListComponent = useMemo(() => {
		switch (tab) {
			case "과제":
				return <TodoLayout />;
			case "다운로드":
				return <AssignmentLayout />;
			case "알림":
				return <AlarmLayout />;
			default:
				return <TodoLayout />;
		}
	}, [tab]);

	return (
		<Container show={show}>
			<header>
				<div className="box">
					{isUpdated ? <ImageButton
						title="구글 연동"
						icon={googleCalendarIcon}
						onClick={postTodoLists}
					/> : <ImageButtonContainer>
						<ActionIcon icon={faSpinner} className="loading" />
						</ImageButtonContainer>}
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
			{TabListComponent}
		</Container>
	);
}

export default TodoContainer;
