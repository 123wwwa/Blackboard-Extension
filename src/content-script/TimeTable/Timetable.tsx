/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useState } from "react";
import {

    selectIsLectureLoaded,
    selectShapedLectureList,
    reloadBB_alarms,
    getLectureList,
} from "../../features/lecture_reducer";
import { useSelector, useDispatch, Provider } from "react-redux";
import { AppDispatch, RootState, store } from "../../features/store";
import { LectureGrid } from "./common/LectureGrid";
import ActionIcon from "../Todo/common/ActionIcon";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { LectureCard } from "./LectureCard";
import { getMemberShip } from "../../features/lecture_reducer";
const HeadHeight = 30;

const RenderTableDay = () => {
    const dispatch: AppDispatch = useDispatch();
    //const lectureList = useSelector(selectLectureList);
    const isLectureListLoaded = useSelector(selectIsLectureLoaded);
    const shapedLectureList: any = useSelector<RootState>(selectShapedLectureList);
    const [tableHeight, setTableHeight] = useState<number>(40);
    const [tableWidth, setTableWidth] = useState<number>(70); // aspect ratio 16:9
    useEffect(() => {
        const vh_7 = window.innerHeight * 0.7;
        setTableHeight(vh_7 / 13);
        setTableWidth(((vh_7 / 13) * 16) / 9);
    }, []);
    useEffect(() => {
        dispatch(reloadBB_alarms as any);
        if(window.location.href.includes("ultra")) {
            dispatch(getMemberShip as any);
        }else{
            dispatch(getLectureList as any);
        }
    }, [dispatch]);
    const shuffleColor = () => {
        dispatch(getMemberShip as any);
    }
    const dayList = ["월", "화", "수", "목", "금"];
    const bgColordiv = document.getElementsByClassName("portlet clearfix")[1] as HTMLElement;
    const [gridBgColor, setGridBgColor] = useState(
        'rgba(0, 0, 0, 0)'
    );
    return (

        <div
            style={{
                display: "flex",
                flexDirection: "row",
            }}
            id = "timeTable"
        >
            {isLectureListLoaded && (
                <>
                    <div>
                        <LectureGrid
                            width="20px"
                            height={HeadHeight.toString() + "px"}
                            color={gridBgColor}
                        >
                            <ActionIcon
                                icon={faRefresh}
                                onClick={shuffleColor}
                            />
                        </LectureGrid>
                        {[...Array(12)].map((x, j) => {
                            return (
                                <LectureGrid
                                    width="20px"
                                    height={tableHeight.toString() + "px"}
                                    color={gridBgColor}
                                >
                                    <span>{j + 9}</span>
                                </LectureGrid>
                            );
                        })}
                    </div>
                    {[...Array(5)].map((x, i) => {
                        return (
                            <div>
                                {shapedLectureList[i].map((item: any) => {
                                    return (
                                        <>
                                            <LectureCard
                                                item={item}
                                                tableHeight={tableHeight}
                                                tableWidth={tableWidth}
                                            ></LectureCard>
                                        </>
                                    );
                                })}
                                <LectureGrid
                                    width={tableWidth.toString() + "px"}
                                    height={HeadHeight.toString() + "px"}
                                    color={gridBgColor}
                                >
                                    {dayList[i]}
                                </LectureGrid>
                                {[...Array(12)].map(() => {
                                    return (
                                        <LectureGrid
                                            width={tableWidth.toString() + "px"}
                                            height={tableHeight.toString() + "px"}
                                            color={gridBgColor}
                                        ></LectureGrid>
                                    );
                                })}
                            </div>
                        );
                    })}
                </>
            )}
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
            <Provider store={store}>
                <RenderTableDay />
            </Provider>
        </div>
    );
};

export default TimeTable;
