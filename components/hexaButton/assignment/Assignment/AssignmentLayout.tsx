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
