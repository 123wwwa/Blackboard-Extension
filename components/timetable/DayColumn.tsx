import React from 'react';
import LectureGrid from './LectureGrid';
import ActionIcon from '~components/common/ActionIcon';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

const DayColumn = ({ HeadHeight, tableHeight, gridBgColor }) => {
    return (
        <div>
            <LectureGrid width="20px" height={`${HeadHeight}px`} color={gridBgColor}>
                <ActionIcon icon={faRefresh} />
            </LectureGrid>
            {[...Array(12)].map((_, j) => (
                <LectureGrid
                    key={`hour-${j}`}
                    width="20px"
                    height={`${tableHeight}px`}
                    color={gridBgColor}
                >
                    <span>{j + 9}</span>
                </LectureGrid>
            ))}
        </div>
    );
};

export default DayColumn;