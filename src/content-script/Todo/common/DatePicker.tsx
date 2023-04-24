import React from "react";
import styled from "@emotion/styled";
import DatePickerComp from "react-datepicker";
import { ko } from "date-fns/esm/locale";

import "react-datepicker/dist/react-datepicker.css";
import TextInput from "./TextInput";
import ActionIcon from "./ActionIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

function DatePicker() {
	const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
	console.log(currentDate);

	return (
		<DatePickerComp
			locale={ko}
			showTimeSelect
			selected={currentDate}
			dateFormat={"yyyy.MM.dd HH:mm"}
			minDate={new Date()}
			onChange={(date: Date) => setCurrentDate(date)}
			customInput={<TextInput icon={<FontAwesomeIcon icon={faCalendar} opacity="0.4" />} />}
		/>
	);
}

export default DatePicker;
