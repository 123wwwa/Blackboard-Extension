import { BB_alarm } from "type"


const AlarmCard = (props: {alarm: BB_alarm}) => {
    return(
        <div>
            {props.alarm.title}
        </div>
    )
}
export default AlarmCard;