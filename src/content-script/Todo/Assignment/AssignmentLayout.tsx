import React, { useState } from "react";
import AssignmentFooter from "./AssignmentFooter";
import AssignmentList from "./AssignmentList";
import { AssignmentAlertFooter } from "./AssignmentAlertFooter";
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
