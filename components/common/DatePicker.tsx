import React from "react";
import DatePickerComp from "react-datepicker";
import { ko } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
type Props = {
	currentDate: Date;
	setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};
function DatePicker({ currentDate, setCurrentDate}: Props) {
	const onChangeDate = (date: Date) => {
		const now = +new Date();
		if(+date < now) {
			setCurrentDate(new Date());
			return;
		}
		setCurrentDate(date);
	}
	return (
		<DatePickerComp
			locale={ko}
			showTimeSelect
			selected={currentDate}
			dateFormat={"yyyy.MM.dd HH:mm"}
			minDate={new Date()}
			onChange={onChangeDate}
			customInput={<TextInput icon={<FontAwesomeIcon icon={faCalendar} opacity="0.4" />} />}
		/>
	);
}

export default DatePicker;
