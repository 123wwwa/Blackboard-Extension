import { css } from "@emotion/react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { AssignmentAlertFooter } from "./AssignmentAlertFooter";
import AssignmentFooter from "./AssignmentFooter";
import AssignmentList from "./AssignmentList";

function AssignmentLayout() {
	const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
	return (
		<>
			<AssignmentList
				activeLectureId={activeLectureId}
				setActiveLectureId={setActiveLectureId}
			/>
			{activeLectureId ? <AssignmentFooter activeLectureId={activeLectureId} /> : <AssignmentAlertFooter/>}
		</>
	);
}

export default AssignmentLayout;
