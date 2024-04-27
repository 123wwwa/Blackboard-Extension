import React from 'react';
import LectureGrid from './LectureGrid';
import LectureCard from './LectureCard';

const DaySchedule = ({ day, shapedDayLectures, HeadHeight, tableWidth, tableHeight, gridBgColor }) => {
    return (
        <div key={`day-${day}`}>
            <LectureGrid width={`${tableWidth}px`} height={`${HeadHeight}px`} color={gridBgColor}>
                {day}
            </LectureGrid>
            {shapedDayLectures.map((item, index) => (
                <LectureCard key={item.id + index} item={item} tableHeight={tableHeight} tableWidth={tableWidth} />
            ))}
            {[...Array(12)].map((_, j) => (
                <LectureGrid
                    key={`hour-${j}`}
                    width={`${tableWidth}px`}
                    height={`${tableHeight}px`}
                    color={gridBgColor}
                />
            ))}
        </div>
    );
};

export default DaySchedule;
