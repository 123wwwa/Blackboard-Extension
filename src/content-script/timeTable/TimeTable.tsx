/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useState } from 'react'
import { getLectureList ,reloadTodoList,selectLectureList, selectIsLectureLoaded, selectShapedLectureList } from '../../features/lecture_reducer';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { AppDispatch, RootState, store } from '../../features/store'
import { LectureGrid } from './common/LectureGrid';
import styled  from '@emotion/styled';
import ActionIcon  from '../Todo/common/ActionIcon';
import {
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
const HeadHeight = 30;
const TableHeight = 45;
const TableWidth = 80;

const RenderTableDay = () => {
  const [logoURL, setLogoURL] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const lectureList = useSelector(selectLectureList);
  const isLectureListLoaded = useSelector(selectIsLectureLoaded);
  const shapedLectureList: any = useSelector<RootState>(selectShapedLectureList);

  const LectureContent = styled.div<{marginTop?: string, height?: string, backgroundColor?: string}>`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top:${props=>props.marginTop};
  background-color: ${props=>props.backgroundColor};
  height: ${props=>props.height};
  &:hover {
    filter: brightness(80%);
    cursor: pointer;
  }
  `;
  const LectureTextArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `
  const LectureName = styled.span`
  color: #00748b;
  font: 700 .8em "Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 13px;
  `
  const LecturePlace = styled.span`
  color:darkgray;
  font-weight: bold;
  font-size: 11px;
  `
  const LectureDiv2 = styled.div`
  position: absolute;
  width: 80px;
  border: 1px solid transparent;
  
  text-align: center;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `
  const LectureDiv = (props: any) => {
    const marginTop: number = (props.item["timeplace"].start - (9 * 12)) / 12 * (TableHeight) + (HeadHeight); // minus 9 hour to start from 9 
    const height: number = (props.item["timeplace"].end - props.item["timeplace"].start) / 12 * (TableHeight);
    const place = props.item["timeplace"].place;
    const link = props.item["link"];
    return (
      <LectureDiv2>
        <LectureContent
          marginTop={marginTop.toString()+"px"}
          height={height.toString()+"px"}
          backgroundColor={props.item["color"]}

          onClick={() => {
            window.open(link, "_blank");
          }}>
          <LectureTextArea>
            <LectureName>{props.item["name"]}</LectureName>
            <LecturePlace>{place}</LecturePlace>
          </LectureTextArea>
        </LectureContent>
      </LectureDiv2>

    )
  }
  useEffect(() => {
    dispatch(getLectureList as any);
    setLogoURL(chrome.runtime.getURL("public/assets/HeXA_logo.png"));
    new BroadcastChannel("lectureInfoLastUpdate").onmessage = (e) => {
      dispatch(getLectureList as any);
      dispatch(reloadTodoList as any);
    }
  }, [dispatch])
  const emitRefresh = () => {
    new BroadcastChannel("reloadLectureList").postMessage("reloadLectureList");
  }
  const dayList = ["월", "화", "수", "목", "금"];
  const bgColordiv = document.getElementsByClassName("portlet clearfix")[1] as HTMLElement;
  const [gridBgColor, setGridBgColor] = useState(window.getComputedStyle(bgColordiv,null).getPropertyValue('background-color')); 
  return (
    <>

      <div style={{
        display: "flex", flexDirection: "row"
      }}>
        {isLectureListLoaded && <>
          <div>
            <LectureGrid width='20px' height={HeadHeight.toString()+"px"} color={gridBgColor}>
            <ActionIcon icon={faRefresh} onClick={emitRefresh}/>
            </LectureGrid>
            {[...Array(12)].map((x, j) => {
              return (<LectureGrid width='20px' height={TableHeight.toString()+"px"} color={gridBgColor}>
                <span>
                  {j + 9}
                </span>
              </LectureGrid>)
            })}
          </div>
          {[...Array(5)].map((x, i) => {
            return (<div>
              {shapedLectureList[i].map((item: any) => {
                return (<>
                  <LectureDiv item={item}></LectureDiv>
                </>)
              })}
              <LectureGrid width={TableWidth.toString()+"px"} height={HeadHeight.toString()+"px"} color={gridBgColor}>
                {dayList[i]}
              </LectureGrid>
              {[...Array(12)].map(() => {
                return (<LectureGrid
                    width= {TableWidth.toString()+"px"} height= {TableHeight.toString()+"px"} color={gridBgColor}>                  
                </LectureGrid>)
              })}
            </div>)
          })}
        </>}
      </div>
    </>
  )
}
const TimeTable = () => {
  return (
    <div id="parent"
      style={{
        height: "440px",
        width: "100%",
        marginLeft: "5px"
      }}>
      <Provider store={store}>
        <RenderTableDay />
      </Provider>
    </div>

  )
}

export default TimeTable;

