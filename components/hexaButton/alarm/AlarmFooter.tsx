/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
	faBook,
	faGrip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useState } from "react";
import type { AlarmFilter } from "~components/hexaButton/alarm/alramFilter";
import useLectureStore from "~shared/stores/lectureStore";
import Popover from "~components/common/Popover";
import { RangeDatePicker } from "~components/hexaButton/alarm/RangeDatePicker"


const styles = {
	Wrapper: css({
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
		padding: "10px 14px",
		gap: "11px",
	}),

	Button: css({
		display: "flex",
		gap: "9px",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "14px",
		fontWeight: 400,
		cursor: "pointer",
		padding: "7px 14px",
		borderRadius: "10px",
		transition: "all 0.2s ease-in-out",
		"&:hover": {
			backgroundColor: "rgba(0, 0, 0, 0.1)",
		},

		p: {
			opacity: 0.5,
		},
	}),

	Active: css({
		backgroundColor: "rgba(0, 0, 0, 0.1)",
	}),

	Divider: css({
		width: "1px",
		height: "10px",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	}),
};
type Props = {
	setFilter: React.Dispatch<React.SetStateAction<AlarmFilter>>;
	filter: AlarmFilter;
};
const AlarmFooter = ({ setFilter, filter }: Props) => {
	const {lectureObject, alarmList} = useLectureStore();
	const lectureNames = useMemo(() => {
		return Array.from(new Set(Object.entries(lectureObject).map(([_, lecture]) => lecture.name)));
	}, [lectureObject]); 
	useEffect(() => {
		setFilter((prev) => ({ ...prev, lecture: lectureNames }));
	}, [lectureNames]);
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
	const [showSubjects, setShowSubjects] = useState<boolean>(false);
	const [showAnnouncements, setShowAnnouncements] = useState<boolean>(false);
	const alarmTypes = [...new Set(Object.entries(alarmList).map(([_, announcement]) => announcement.type))];
	const setLectureFilter = (lecture: string) => {
		if(filter.lecture.includes(lecture)){

			// check if isLecture is in filter.lecture
			setFilter((prev) => ({ ...filter, lecture: [...filter.lecture.filter((l) => l !== lecture)] }));
			return;
		}
		setFilter((prev) => ({ ...filter, lecture: [...new Set([...filter.lecture, lecture])] }));
	}
	const setTypeFilter = (type: string) => {
		if(filter.type.includes(type)){
			setFilter((prev) => ({ ...filter, type: [...filter.type.filter((t) => t !== type)] }));
			return;
		}
		setFilter((prev) => ({ ...filter, type: [...new Set([...filter.type, type])] }));
	}
	return (
		<footer css={styles.Wrapper}>
			<Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
				<Popover.Target>
					<div
						css={[styles.Button, ...(showDatePicker ? [styles.Active] : [])]}
					>
						<FontAwesomeIcon icon={faClock} opacity="0.5" />
						<p>날짜 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content>
					<RangeDatePicker filter={filter} setFilter={setFilter} />
				</Popover.Content>
			</Popover>
			<div css={styles.Divider} />
			<Popover open={showSubjects} onOpenChange={setShowSubjects}>
				<Popover.Target>
					<div css={[styles.Button, ...(showSubjects ? [styles.Active] : [])]}>
						<FontAwesomeIcon icon={faBook} opacity="0.5" />
						<p>과목 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content css={css({ minWidth: "135px" })}>
					{lectureNames.map((lecture) => {
						const isChecked = filter.lecture.includes(lecture);
						return(<Popover.Item 
							css={css({ fontSize: "12px", background: isChecked?"#E9E9E9":"#FFFFFF"})} 
							onClick={setLectureFilter.bind(null, lecture)}
							key = {lecture}
						>
							{lecture}
						</Popover.Item>
						)
					})}
				</Popover.Content>
			</Popover>
			<div css={styles.Divider} />
			<Popover open={showAnnouncements} onOpenChange={setShowAnnouncements}>
				<Popover.Target>
					<div
						css={[styles.Button, ...(showAnnouncements ? [styles.Active] : [])]}
					>
						<FontAwesomeIcon icon={faGrip} opacity="0.5" />
						<p>타입 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content css={css({ minWidth: "125px" })}>
					{alarmTypes.map((ann) => {
						const isChecked = filter.type.includes(ann);
						return(<Popover.Item 
							css={css({ fontSize: "12px", background: isChecked?"#E9E9E9":"#FFFFFF" })} 
							onClick={setTypeFilter.bind(null, ann)}
							key = {ann}
						>{ann}
						</Popover.Item>)
					})}
				</Popover.Content>
			</Popover>
		</footer>
	);
}

export default AlarmFooter;
