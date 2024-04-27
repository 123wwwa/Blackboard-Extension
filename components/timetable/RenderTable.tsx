import React, { useEffect, useState } from 'react';
import  useLectureStore  from '~shared/stores/lectureStore';
import { loadLectureList, updateLectureList } from '~features/events/lectureListUtils';
import DaySchedule from './DaySchedule';
import DayColumn from './DayColumn';

const RenderTable = () => {
    const { isLectureLoaded, shapedLectureList } = useLectureStore(state => state);
    const [tableHeight, setTableHeight] = useState(40);
    const [tableWidth, setTableWidth] = useState(70); // aspect ratio 16:9
    const HeadHeight = 30;
    const dayList = ["월", "화", "수", "목", "금", "토"];
    const [gridBgColor, setGridBgColor] = useState('rgba(0, 0, 0, 0)');

    useEffect(() => {
        const vh_7 = window.innerHeight * 0.7;
        setTableHeight(vh_7 / 13);
        setTableWidth((vh_7 / 13 * 16) / 9);
    }, []);

    useEffect(() => {
        window.location.href.includes("ultra") ? updateLectureList() : loadLectureList();
    }, []);

    if (!isLectureLoaded) return <div>Loading...</div>;

    return (
        <div style={{ display: "flex", flexDirection: "row" }} id="timeTable">
            <DayColumn
                HeadHeight={HeadHeight}
                tableHeight={tableHeight}
                gridBgColor={gridBgColor}
            />
            {dayList.map((day, i) => (
                <DaySchedule
                    key={`day-${i}`}
                    day={day}
                    shapedDayLectures={shapedLectureList[i]}
                    HeadHeight={HeadHeight}
                    tableWidth={tableWidth}
                    tableHeight={tableHeight}
                    gridBgColor={gridBgColor}
                />
            ))}
        </div>
    );
};

export default RenderTable;