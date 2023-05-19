import { css } from "@emotion/react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
	faBook,
	faGrip,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectLectureList } from "../../../features/lecture_reducer";
import { useSelector } from "react-redux";
import { LectureList } from "type";
import { announcements } from "../../../constants";
import Popover from "../common/Popover";
import { useState } from "react";

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

function AlarmFooter() {
	const lectureList: LectureList = useSelector(selectLectureList);
	const lectureNames = Object.entries(lectureList).map(
		([_, lecture]) => lecture.name
	);
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
	const [showSubjects, setShowSubjects] = useState<boolean>(false);
	const [showAnnouncements, setShowAnnouncements] = useState<boolean>(false);

	return (
		<div css={styles.Wrapper}>
			<Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
				<Popover.Target>
					<div
						css={[styles.Button, ...(showDatePicker ? [styles.Active] : [])]}
					>
						<FontAwesomeIcon icon={faClock} opacity="0.5" />
						<p>날짜 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content>Date Picker</Popover.Content>
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
					{lectureNames.map((lecture) => (
						<Popover.Item css={css({ fontSize: "12px" })}>
							{lecture}
						</Popover.Item>
					))}
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
				<Popover.Content css={[css({ minWidth: "125px" })]}>
					{announcements.map((ann) => (
						<Popover.Item css={css({ fontSize: "12px" })}>{ann}</Popover.Item>
					))}
				</Popover.Content>
			</Popover>
		</div>
	);
}

export default AlarmFooter;
