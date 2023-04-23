import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

import { AppDispatch, store } from '../../features/store'
import { useDispatch, useSelector} from 'react-redux'
import { selectLectureList, updateLectureAssignment } from '../../features/lecture_reducer'
import { Assignment, AssignmentList } from "type";


const AssignmentList = () => {  
    const dispatch:AppDispatch = useDispatch();
    const [assignmentList, setAssignmentList] = useLocalStorage<AssignmentList>('fileInfo', {});
    const lectureList = useSelector(selectLectureList);
    useEffect(()=>{
       updateLectureAssignment(assignmentList)(dispatch);
    },[dispatch, assignmentList])
    if (Object.keys(assignmentList).length === 0 && assignmentList.constructor === Object) {
        return (
            <div>
                과제가 없습니다.
            </div>
        )
    }
    return (
        <div id="assignment-list">
            {Object.entries(assignmentList).map(([key, value]) => {
                let item: Assignment = value;
                return (
                    <div>
                        <div>
                            {item.Name}
                        </div>
                        <div id="flex-row">
                            <label htmlFor="file">{parseFloat(item.score) / parseFloat(item.totalscore) * 100 + "%"}</label>
                            <progress id="file" value={item.score} max={item.totalscore}></progress>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AssignmentList;