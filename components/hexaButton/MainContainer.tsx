 /** @jsxImportSource @emotion/react */
import TodoMenu from "./todo/TodoMenu";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import TodoLayout from "./todo/TodoLayout";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useLectureStore from "~shared/stores/lectureStore";
import { postTodoList, updateTodoList } from "~features/events/todoListUtils";
import ImageButton, { styles as ImageButtonStyles }  from "~components/common/ImageButton";
import AssignmentLayout from "./assignment/AssignmentLayout";
import AlarmLayout from "./alarm/AlarmLayout";
import { updateLectureList } from "~features/events/lectureListUtils";
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
function MainContainer({ show, setShow, position }: Props) {
	const [tab, setTab] = useState<(typeof TodoTabs)[number]>("과제");
	const { todoList } = useLectureStore(state => state);
	const [isUpdated, setIsUpdated] = useState(true);
	const postTodoLists = async () => {
		let isChrome =
			/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		if (!isChrome) {
			alert("구글 크롬 브라우저에서만 사용 가능한 기능입니다.");
			return;
		}
		setIsUpdated(false);
		const res = await postTodoList(todoList);
		if (res) {
			setIsUpdated(true);
		}
	};
	useEffect(() => {
		updateLectureList().then(() => {
			updateTodoList();
		});
	}, []);

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
							icon={"assets/icons/icon-google-calendar.png"}
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

export default MainContainer;
