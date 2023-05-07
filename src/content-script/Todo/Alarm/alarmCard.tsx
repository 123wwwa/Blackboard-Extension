import { BB_alarm } from "type";
import styled from "@emotion/styled";
import moment from "moment";

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	cursor: pointer;
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
`;

const Detail = styled.div`
	flex-basis: 45%;
	word-break: break-word;
`;

const Type = styled.div`
	flex-basis: 15%;
	margin-left: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	color: #DC2626;
	word-break: break-word;
`;

const AlarmCard = (props: { alarm: BB_alarm }) => {
	const type = props.alarm.type;
	const typeName = type.includes("Announcement")
		? "공지"
		: type.includes("Assignment")
		? "과제"
		: type.includes("Content")
		? "자료"
		: "기타";
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
			<Detail>{props.alarm.title}</Detail>
			<Type>{typeName}</Type>
		</Container>
	);
};
export default AlarmCard;
