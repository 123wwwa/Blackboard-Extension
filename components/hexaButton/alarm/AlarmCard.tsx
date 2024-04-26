
import styled from "@emotion/styled";
import moment from "moment";
import { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { BB_alarm, Todo } from "~shared/types/blackboardTypes";
import { useSettingStore } from "~shared/stores/settingStore";
import { extractTodo } from "~features/events/chatgpt";
import { addTodoItem } from "~features/events/todoListUtils";
import Popover from "~components/common/Popover";
import ActionIcon from "~components/common/ActionIcon";
import { getAnnouncementDisplayText } from "~features/getAnnouncementDisplayText";

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	filter: brightness(100%);
	transition: all 0.2s ease-in-out;
	cursor: pointer;

	&:hover {
		filter: brightness(80%);
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 4px;
	word-break: break-all;
	flex-basis: 30%;
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 700;
	font-size: 14px;
	max-width: 300px;
	margin: 0;
`;

const Subtitle = styled.p`
	font-size: 12px;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.7);
	margin-block: auto;
`;

const Detail = styled.div`
	flex-basis: 45%;
	word-break: break-word;
	font-size: 14px;
	font-weight: 700;
`;

const Type = styled.div`
	flex-basis: 15%;
	margin-left: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	color: #dc2626;
	word-break: break-word;
`;

const AlarmCard = (props: { alarm: BB_alarm }) => {
	const [show, setShow] = useState(false);
	const {isPreviousVersion} = useSettingStore(state => state);
	const handleMouseOver = () => {
		setShow(true);
	};

	const handleMouseLeave = () => {
		setShow(false);
	};
	const onClickAdd = async(e: React.MouseEvent) => {
		let resJSON = await extractTodo(props.alarm);
		if (resJSON) {
			// addtodo action
			const todo:Todo = {
				content: resJSON.title,
				color: props.alarm.color,
				date: new Date(resJSON.date).getTime(),
				linkcode: "https://blackboard.unist.ac.kr/" +props.alarm.url,
				userCreated: false,
			}
			addTodoItem(todo);
		}
	}
	
	return (
		<Container
			color={props.alarm.color}
			onClick={() => {
				window.open(
					"https://blackboard.unist.ac.kr/" + props.alarm.url,
					"_blank"
				);
			}}
		>
			<Content>
				<Title>{props.alarm.course_name}</Title>
				<Subtitle>
					{moment(new Date(props.alarm.date)).format("YYYY-MM-DD HH:mm")}
				</Subtitle>
			</Content>
			<Popover open={show} onOpenChange={setShow}>
				<Popover.Target>
					<Detail onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
						{props.alarm.title}
					</Detail>
				</Popover.Target>
				<Popover.Content
					onClick={(e) => {
						e.stopPropagation();
					}}
					onMouseOver={handleMouseOver}
					onMouseLeave={handleMouseLeave}
				>
					<div style={{ display: "flex", flexDirection: "row"}}>
						<div style={{"height": "30px"}}>
							<span style={{ fontSize: "14px"}}>{props.alarm.title}</span>
						</div>
						<ActionIcon icon={faPlus} onClick={onClickAdd} />
					</div>
					<div dangerouslySetInnerHTML={{ __html: props.alarm.detail }} 
					style={{maxWidth: "500px"}}/>
				</Popover.Content>
			</Popover>

			<Type>{getAnnouncementDisplayText(props.alarm.type)}</Type>
		</Container>
	);
};
export default AlarmCard;