import ImageButton, { styles as ImageButtonStyles } from "./common/ImageButton";
import TodoMenu from "./TodoMenu";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	postTodoList,
	reloadTodoList,
	selectTodoList,
} from "../../features/lecture_reducer";
import TodoLayout from "./TodoLayout";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AssignmentLayout from "./Assignment/AssignmentLayout";
import AlarmLayout from "./Alarm/AlarmLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	position: {
		x: number;
		y: number;
	};
};

const Container = styled.div<{
	show: boolean;
	position: { x: number; y: number };
}>`
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

			.content-tabs {
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
						background-color: #f8f8f8;
					}

					&:hover {
						filter: brightness(90%);
					}
				}
			}
		}
	}
`;

export const TodoTabs = ["과제", "다운로드", "알림"] as const;
export const TabListText = styled.p`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: inherit;
	font-style: inherit;
	font-family: inherit;
`;
function TodoContainer({ show, setShow, position }: Props) {
	const [tab, setTab] = useState<(typeof TodoTabs)[number]>("과제");
	const todoList = useSelector(selectTodoList);
	const [isUpdated, setIsUpdated] = useState(true);
	const dispatch = useDispatch();
	const postTodoLists = () => {
		let isChrome =
			/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		if (!isChrome) {
			alert("구글 크롬 브라우저에서만 사용 가능한 기능입니다.");
			return;
		}
		setIsUpdated(false);
		postTodoList(todoList);
	};
	useEffect(() => {
		dispatch(reloadTodoList as any);
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action === "calendarUpdateDone") {
				setIsUpdated(true);
			}
		});
	}, [dispatch]);

	const TabListComponent = (tab: any) => {
		switch (tab.tab) {
			case "과제":
				return <TodoLayout />;
			case "다운로드":
				return <AssignmentLayout />;
			case "알림":
				return <AlarmLayout />;
			default:
				return <TodoLayout />;
		}
	};

	return (
		<Container show={show} position={position}>
			<header>
				<div className="box">
					{isUpdated ? (
						<ImageButton
							title="구글 연동"
							icon={"public/icons/icon-google-calendar.png"}
							onClick={postTodoLists}
						/>
					) : (
						<button css={ImageButtonStyles.Container}>
							<FontAwesomeIcon icon={faSpinner} spin />
						</button>
					)}
					<div className="content-tabs">
						{TodoTabs.map((tabName) => (
							<TabListText
								key={tabName}
								className={`${tab === tabName ? "active" : ""}`}
								onClick={() => setTab(tabName)}
							>
								{tabName}
							</TabListText>
						))}
					</div>
				</div>
				<TodoMenu setShow={setShow} tab={tab} />
			</header>
			<TabListComponent tab={tab} />
		</Container>
	);
}

export default TodoContainer;
