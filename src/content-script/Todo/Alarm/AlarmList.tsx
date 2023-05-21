import {
	reloadBB_alarms,
	selectBB_alarmList,
} from "../../../features/lecture_reducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlarmCard from "./AlarmCard";
import styled from "@emotion/styled";
import { Filter } from "./Filter";
const AssignmentListWrapper = styled.article`
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
`;
type Props = {
	filter: Filter;
};
const AlarmList = ({ filter }: Props) => {
	const dispatch = useDispatch();
	const BB_alarmList = useSelector(selectBB_alarmList);
	useEffect(() => {
		dispatch(reloadBB_alarms as any);
	}, [dispatch]);
	return (
		<AssignmentListWrapper>
			{BB_alarmList.length != 0 ? Object.entries(
				BB_alarmList.slice().sort((a, b) => {
					return b.date - a.date;
				})
			).map(([key, value]) => {
				const isInDateRange = value.date >= filter.startDate && value.date <= filter.endDate;
				const isCourseNameMatched = filter.lecture.includes(value.course_name);
				if (filter.type.includes(value.type) && isInDateRange && isCourseNameMatched) {
					return (
						<div>
							<AlarmCard alarm={value} />
						</div>
					);
				}
			}) : <div>알림이 없습니다. 새로고침을 하시거나 로그인 상태인지 확인하세요.</div>}
		</AssignmentListWrapper>
	);
};
export default AlarmList;
