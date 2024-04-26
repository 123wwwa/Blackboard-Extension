import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import type { AlarmFilter } from "~components/hexaButton/alarm/alramFilter";

type Props = {
    setFilter: React.Dispatch<React.SetStateAction<AlarmFilter>>;
    filter: AlarmFilter;
};
export const RangeDatePicker = ({ setFilter, filter }: Props) => {
    const [startDate, setStartDate] = useState(new Date(filter.startDate));
    const [endDate, setEndDate] = useState(new Date(filter.endDate));
    const onChangeDate = (dates: any) => {
        const [startDate, endDate] = dates;
        setStartDate(startDate);
        setFilter((prev) => ({ ...prev, startDate: new Date(startDate).getTime() }));
        setEndDate(endDate);
        setFilter((prev) => ({ ...prev, endDate: new Date(endDate).getTime() }));
    };
    return (
        <ReactDatePicker
            selected={startDate}
            onChange={onChangeDate}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
        />
    )
};