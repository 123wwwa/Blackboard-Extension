import { BB_alarm } from "type"
import styled from "@emotion/styled";
const DownloadWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 4px 2px;

	&:hover {
		border-radius: 5px;
		background-color: rgba(28, 25, 23, 0.35);
	}
`;

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 63px;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	cursor: pointer;

	&:hover:not(:has(${DownloadWrapper}:hover)) {
		filter: brightness(80%);
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 4px;
	flex-basis: 60%;
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
const AlarmCard = (props: {alarm: BB_alarm}) => {
    const timeStampToDate = (timeStamp:number) =>{
        const date = new Date(timeStamp);
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
    }
    return(
        <Container color={props.alarm.color}
            onClick={()=>{
                window.open("https://blackboard.unist.ac.kr/"+props.alarm.url, "_blank");
            }

            }>
            <Content>
				<Title>{props.alarm.course_name}:{props.alarm.title}</Title>
				<Subtitle>{timeStampToDate(props.alarm.date)}</Subtitle>
			</Content>
        </Container>
    )
}
export default AlarmCard;