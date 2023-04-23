/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { useLocalStorage } from "usehooks-ts";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { css } from "@emotion/react";
import { Assignment, FileUrl } from "../../type";
import TodoButton from "./TodoButton";
import TodoContainer from "./TodoContainer";
// const TodoBtn =()=>{
//     let [showMainArea, setShowMainArea] = useState<boolean>(false);
//     useEffect(()=>{

//     })
//     return(
//         <div>
//         <button
//             id ="todo-btn"
//             onClick={()=>{
//             setShowMainArea(!showMainArea);
//         }}>
//             Todo
//         </button>
//         <div id ="assignment-area"
//         style={{
//             display: showMainArea ? "block" : "none"
//         }}>
//             <AssignmentList/>
//         </div>
//         </div>
//     )
// }
// const AssignmentList = ()=>{
//     interface AssignmentList{
//         [key:string]:Assignment
//     }
//     const [assignmentList, setAssignmentList] = useLocalStorage<AssignmentList>('fileInfo', {});
//     // useEffect(()=>{
//     //     console.log(assignmentList)
//     // },[assignmentList])
//     if(Object.keys(assignmentList).length === 0 && assignmentList.constructor === Object){
//         return(
//             <div>
//                 과제가 없습니다.
//             </div>
//         )
//     }
//     return(
//         <div id="assignment-list">
//         {Object.entries(assignmentList).map(([key,value])=>{
//             let item:Assignment = value;
//             return(
//                 <div>
//                     <div>
//                         {item.Name}
//                     </div>
//                     <div>
//                         <label htmlFor="file">{parseFloat(item.score)/parseFloat(item.totalscore)*100+ "%"}</label>
//                         <progress id="file" value={item.score} max={item.totalscore}></progress>
//                     </div>
//                 </div>
//             )
//         })}
//         </div>
//     )
// }

function Todo() {
	const [showMainArea, setShowMainArea] = useState<boolean>(false);

	return (
		<div
			css={css({
				zIndex: 10,
				position: "fixed",
				right: "30px",
				bottom: "30px",
				fontSize: "16px",
				fontFamily: "Pretendard-Regular",
			})}
		>
			<TodoContainer show={showMainArea} setShow={setShowMainArea} />
			<TodoButton setShow={setShowMainArea} />
		</div>
	);
}

export default Todo;
