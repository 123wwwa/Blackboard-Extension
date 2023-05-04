import { reloadBB_alarms, selectBB_alarmList } from "features/lecture_reducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlarmCard from "./alarmCard";

const AlarmList = () =>{
    const dispatch = useDispatch(); 
    const BB_alarmList = useSelector(selectBB_alarmList);
    useEffect(()=>{
        dispatch(reloadBB_alarms as any);
    },[dispatch])
    return(
        <>
        {Object.entries(BB_alarmList).map(([key, value]) => {
            if(value.type === "Announcement Available"){
                return (<div>
                    <AlarmCard alarm={value}/>
                </div>)
            }
        })
        }
        </>
    )
}
export default AlarmList;