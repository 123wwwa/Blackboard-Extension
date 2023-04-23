import { Assignment } from "type";
import { useLocalStorage } from "usehooks-ts";

interface AssignmentList {
	[key: string]: Assignment;
}

const AssignmentList = () => {
	const [assignmentList, setAssignmentList] = useLocalStorage<AssignmentList>(
		"fileInfo",
		{}
	);
	if (
		Object.keys(assignmentList).length === 0 &&
		assignmentList.constructor === Object
	) {
		return <div>과제가 없습니다.</div>;
	}
	return (
		<div id="assignment-list">
			{Object.entries(assignmentList).map(([key, value]) => {
				let item: Assignment = value;
				return (
					<div>
						<div>{item.Name}</div>
						<div>
							<label htmlFor="file">
								{(parseFloat(item.score) / parseFloat(item.totalscore)) * 100 +
									"%"}
							</label>
							<progress
								id="file"
								value={item.score}
								max={item.totalscore}
							></progress>
						</div>
					</div>
				);
			})}
		</div>
	);
};
