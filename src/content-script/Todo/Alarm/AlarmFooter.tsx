import { css } from "@emotion/react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
	faBook,
	faGrip,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "../common/Popover";

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

	Divider: css({
		width: "1px",
		height: "10px",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	}),
};

const mockCourses = [
	"인간 컴퓨터 상호작용",
	"시스템 프로그래밍",
	"고급 프로그래밍",
	"local visit",
	"미분 방정식",
	"미적분 Ⅱ",
	"통계학",
];
const mockSubjects = [
	"공지",
	"자료",
	"디스커션",
	"과제",
	"점수",
	"설문조사",
	"코스 개설",
];

function AlarmFooter() {
	return (
		<div css={styles.Wrapper}>
			<Popover>
				<Popover.Target>
					<div css={styles.Button}>
						<FontAwesomeIcon icon={faClock} opacity="0.5" />
						<p>날짜 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content css={css({ width: "135px" })}>
					{mockCourses.map((course) => (
						<Popover.Item css={css({ fontSize: "12px" })}>
							{course}
						</Popover.Item>
					))}
				</Popover.Content>
			</Popover>
			<div css={styles.Divider} />
			<Popover>
				<Popover.Target>
					<div css={styles.Button}>
						<FontAwesomeIcon icon={faBook} opacity="0.5" />
						<p>과목 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content>Date Picker</Popover.Content>
			</Popover>
			<div css={styles.Divider} />
			<Popover>
				<Popover.Target>
					<div css={styles.Button}>
						<FontAwesomeIcon icon={faGrip} opacity="0.5" />
						<p>타입 선택</p>
					</div>
				</Popover.Target>
				<Popover.Content css={css({ width: "125px" })}>
					{mockSubjects.map((course) => (
						<Popover.Item css={css({ fontSize: "12px" })}>
							{course}
						</Popover.Item>
					))}
				</Popover.Content>
			</Popover>
		</div>
	);
}

export default AlarmFooter;
