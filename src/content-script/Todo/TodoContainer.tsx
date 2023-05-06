import ImageButton from "./common/ImageButton";
import TodoMenu from "./TodoMenu";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { reloadTodoList } from "../../features/lecture_reducer";
import AlarmList from "./Alarm/AlarmList";
import TodoLayout from "./TodoLayout";
import AssignmentLayout from "./Assignment/AssignmentLayout";

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
					position: relative;

					&:after {
						content: "";
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						transform: scaleX(0);
						height: 1px;
						transition: all 300ms;
						border-bottom: 1px solid rgba(0, 0, 0, 0.7);
					}

					&.active:after {
						transform: scaleX(1);
					}
				}
			}
		}
	}
`;

const TodoTabs = ["과제", "다운로드", "일정"];

function TodoContainer({ show, setShow }: Props) {
	const [tab, setTab] = useState("과제");
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(reloadTodoList as any);
	}, [dispatch]);

	const TabListComponent = useMemo(() => {
		switch (tab) {
			case "과제":
				return <TodoLayout />;
			case "다운로드":
				return <AssignmentLayout />;
			case "일정":
				return (
					<>
						<AlarmList />
					</>
				);
			default:
				return <TodoLayout />;
		}
	}, [tab]);

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
			{TabListComponent}
		</Container>
	);
}

export default TodoContainer;
