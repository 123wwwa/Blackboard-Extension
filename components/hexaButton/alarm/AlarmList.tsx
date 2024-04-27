
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";

import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { updateAlarmList } from "~features/events/alarms/alarmListUtils";
import ActionIcon from "~components/common/ActionIcon";
import type { AlarmFilter } from "~components/hexaButton/alarm/alramFilter";
import AlarmCard from "~components/hexaButton/alarm/AlarmCard";
import useLectureStore from "~shared/stores/lectureStore";
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
	filter: AlarmFilter;
};
const AlarmList = ({ filter }: Props) => {
	const [firstLoad, setFirstLoad] = useState<boolean>(false);
	const { alarmList } = useLectureStore();
	let refreshAlarmList = () => {
		updateAlarmList();
	};
	const filteredBB_alarmList = useMemo(() => {
		return alarmList.filter((alarm) => {
			let isInDateRange = alarm.date >= filter.startDate && alarm.date <= filter.endDate;
			let isCourseNameMatched = filter.lecture.includes(alarm.course_name);
			return filter.type.includes(alarm.type) && isInDateRange && isCourseNameMatched;
		});
	}, [filter, alarmList]);
	useEffect(() => {
		setTimeout(() => {
			if (firstLoad) {
				return;
			}
			updateAlarmList();
			setFirstLoad(true);
		}, 500);
	}, [alarmList])
	if (!firstLoad) {
		return (<AssignmentListWrapper>
			<div>로딩중입니다.</div>
		</AssignmentListWrapper>)
	}
	if (filteredBB_alarmList.length == 0) {
		return (<AssignmentListWrapper>
			<div>
				<div>알림이 없습니다. 새로고침을 하시거나 로그인 상태인지 확인하세요.</div>
				<div>새로고침<ActionIcon icon={faRefresh} onClick={refreshAlarmList} /> </div>
			</div>
		</AssignmentListWrapper>)
	}
	return (
		<AssignmentListWrapper>
			{Object.entries(
				filteredBB_alarmList.slice().sort((a, b) => {
					return b.date - a.date;
				})
			).map(([key, value]) => {
				return (
					<div key = {key}>
						<AlarmCard alarm={value} />
					</div>
				);
			})}
		</AssignmentListWrapper>
	);
};
export default AlarmList;
