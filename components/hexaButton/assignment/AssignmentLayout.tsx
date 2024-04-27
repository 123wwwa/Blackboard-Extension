import { useCallback, useState } from "react";
import { AssignmentAlertFooter } from "./AssignmentAlertFooter";
import AssignmentFooter from "./AssignmentFooter";
import AssignmentList from "./AssignmentList";

function AssignmentLayout() {
	const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
	const handleSetLectureId = useCallback((id: string | null) => {
        setActiveLectureId(id);
    }, []);
	return (
		<>
			<AssignmentList
				activeLectureId={activeLectureId}
				setActiveLectureId={handleSetLectureId}
			/>
			{activeLectureId ? <AssignmentFooter activeLectureId={activeLectureId} /> : <AssignmentAlertFooter/>}
		</>
	);
}

export default AssignmentLayout;
