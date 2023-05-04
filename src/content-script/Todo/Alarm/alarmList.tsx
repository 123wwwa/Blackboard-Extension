import { reloadBB_alarms, selectBB_alarmList } from "../../../features/lecture_reducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlarmCard from "./AlarmCard";
import styled from "@emotion/styled";
const AssignmentListWrapper = styled.article`
	width: 100%;
	height: 330px;
	overflow: scroll;
	overflow-x: hidden;
	padding: 5px 14px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	&::-webkit-slider-thumb {
		background: #6c757d;
		border-radius: 8px;
	}
	&::-webkit-scrollbar {
		width: 7px;
		height: 10px;
		background-color: white;
		border-radius: 8px;
	}
`;
const AlarmList = () =>{
    const dispatch = useDispatch(); 
    const BB_alarmList = useSelector(selectBB_alarmList);
    useEffect(()=>{
        dispatch(reloadBB_alarms as any);
    },[dispatch])
    return(
        <AssignmentListWrapper>
        {Object.entries(BB_alarmList.slice().sort((a,b)=>{
            return b.date - a.date;
        })).map(([key, value]) => {
            if(value.type === "Announcement Available"){
                return (<div>
                    <AlarmCard alarm={value}/>
                </div>)
            }
        })
        }
        </AssignmentListWrapper>
    )
}
export default AlarmList;