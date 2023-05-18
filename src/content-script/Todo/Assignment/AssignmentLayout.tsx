import { css } from "@emotion/react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AssignmentFooter from "./AssignmentFooter";
import AssignmentList from "./AssignmentList";

const styles = {
	Info: css({
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		fontSize: "12px",
		fontWeight: 400,
		gap: "9px",
		width: "100%",
		padding: "10px 14px",
	}),
};

function AssignmentLayout() {
	const [activeLectureId, setActiveLectureId] = useState<string | null>(null);

	return (
		<>
			<AssignmentList
				activeLectureId={activeLectureId}
				setActiveLectureId={setActiveLectureId}
			/>
			{activeLectureId ? (
				<AssignmentFooter activeLectureId={activeLectureId} />
			) : (
				<div css={styles.Info}>
					<FontAwesomeIcon icon={faCircleInfo} opacity={0.5} size="lg" />
					<span>과제 제출 주소에 1번 이상 접속해야 파일이 저장됩니다.</span>
				</div>
			)}
		</>
	);
}

export default AssignmentLayout;
