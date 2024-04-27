import { useEffect, useState } from "react";
import ActionIcon from "~components/common/ActionIcon";
import { loadLectureList, updateLectureList } from "~features/events/lectureListUtils";
import useLectureStore from "~shared/stores/lectureStore";
import LectureGrid from "./LectureGrid";
import LectureCard from "./LectureCard";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
const RenderTableDay = () => {
    const { isLectureLoaded, shapedLectureList } = useLectureStore(state => state);
    const [tableHeight, setTableHeight] = useState<number>(40);
    const [tableWidth, setTableWidth] = useState<number>(70); // aspect ratio 16:9
    const HeadHeight = 30;
    useEffect(() => {
        const vh_7 = window.innerHeight * 0.7;
        setTableHeight(vh_7 / 13);
        setTableWidth(((vh_7 / 13) * 16) / 9);
    }, []);
    useEffect(() => {
        if (window.location.href.includes("ultra")) updateLectureList();
        else loadLectureList();
    }, []);
    const dayList = ["월", "화", "수", "목", "금", "토"];
    const [gridBgColor, setGridBgColor] = useState(
        'rgba(0, 0, 0, 0)'
    );
    if (!isLectureLoaded) {
        return <div>Loading...</div>
    }
    return (
        <div style={{
                display: "flex",
                flexDirection: "row",
            }}
            id="timeTable"
        >
            <div>
                <LectureGrid
                    width="20px"
                    height={HeadHeight.toString() + "px"}
                    color={gridBgColor}
                >
                    <ActionIcon
                        icon={faRefresh}
                    />
                </LectureGrid>
                {[...Array(12)].map((x, j) => {
                    return (
                        <LectureGrid
                            key={`day-${x}-hour-${j}`} 
                            width="20px"
                            height={tableHeight.toString() + "px"}
                            color={gridBgColor}
                        >
                            <span>{j + 9}</span>
                        </LectureGrid>
                    );
                })}
            </div>
            {[...Array(dayList.length)].map((x, i) => {
                return (
                    <div key={`day${i}`}>
                        {shapedLectureList[i].map((item: any, index: number) => {
                            return (
                                <div key={item.id+""+index}>
                                <LectureCard
                                    item={item}
                                    tableHeight={tableHeight}
                                    tableWidth={tableWidth}
                                ></LectureCard>
                                </div>
                            );
                        })}
                        <LectureGrid
                            key={i}
                            width={tableWidth.toString() + "px"}
                            height={HeadHeight.toString() + "px"}
                            color={gridBgColor}
                        >
                            {dayList[i]}
                        </LectureGrid>
                        {[...Array(12)].map((x, j) => {
                            return (
                                <LectureGrid
                                    key={`day-${i}-hour-${j}`}
                                    width={tableWidth.toString() + "px"}
                                    height={tableHeight.toString() + "px"}
                                    color={gridBgColor}
                                ></LectureGrid>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
const TimeTable = () => {
    return (
        <div
            id="parent"
            style={{
                height: "100%",
                width: "100%",
                marginLeft: "5px",
            }}
        >
            <RenderTableDay />
        </div>
    );
};
export default TimeTable;