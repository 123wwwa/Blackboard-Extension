/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Lecture, ShapedLecture } from '../../type'
import { reloadLectureList, selectLectureList, selectIsLectureLoaded, selectShapedLectureList } from '../../features/lecture_reducer';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { AppDispatch, RootState, store } from '../../features/store'
const HeadHeight = 30;
const TableHeight = 45;
const TableWidth = 80;
const RenderTableDay = () => {
  const [logoURL, setLogoURL] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const lectureList = useSelector(selectLectureList);
  const isLectureListLoaded = useSelector(selectIsLectureLoaded);
  const shapedLectureList: any = useSelector<RootState>(selectShapedLectureList);



  const LectureDiv = (props: any) => {
    const marginTop: number = (props.item["timeplace"].start - (9 * 12)) / 12 * (TableHeight) + (HeadHeight); // minus 9 hour to start from 9 
    // add 2 to consider margin.
    const height: number = (props.item["timeplace"].end - props.item["timeplace"].start) / 12 * (TableHeight);
    const place = props.item["timeplace"].place;
    const link = props.item["link"];
    return (
      <div id="lectureDiv">
        <div
          id="lectureContent"
          style={{
            backgroundColor: props.item["color"],
            marginTop: marginTop + 'px',
            height: height + 'px',
            width: "100%",
          }}
          onClick={() => {
            window.open(link, "_blank");
          }}>
          <div id="lectureText">
            <span id="lectureName">{props.item["name"]}</span>
            <span id="lecturePlace">{place}</span>
          </div>
        </div>
      </div>

    )
  }
  useEffect(() => {
    dispatch(reloadLectureList as any);
    setLogoURL(chrome.runtime.getURL("public/assets/HeXA_logo.png"));
  }, [dispatch])
  const dayList = ["월", "화", "수", "목", "금"];
  return (
    <>

      <div style={{
        display: "flex", flexDirection: "row"
      }}>
        {isLectureListLoaded && <>
          <div>
            <div id="lectureGrid"
              style={{
                width: "20px", height: HeadHeight,
              }}>
              <img src={logoURL}
                style={{
                  width: "20px", height: "20px",
                }} />
            </div>
            {[...Array(12)].map((x, j) => {
              return (<div id="lectureGrid"
                style={{
                  width: "20px", height: TableHeight,
                }}>
                <span>
                  {j + 9}
                </span>
              </div>)
            })}
          </div>
          {[...Array(5)].map((x, i) => {
            return (<div>
              {shapedLectureList[i].map((item: any) => {
                return (<>
                  <LectureDiv item={item}></LectureDiv>
                </>)
              })}
              <div id="lectureGrid"
                style={{
                  width: TableWidth, height: HeadHeight,
                }}>
                {dayList[i]}
              </div>
              {[...Array(12)].map(() => {
                return (<div id="lectureGrid"
                  style={{
                    width: TableWidth, height: TableHeight,
                  }}>
                </div>)
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
        width: "200%",

      }}>
      <Provider store={store}>
        <RenderTableDay />
      </Provider>
    </div>

  )
}

export default TimeTable;

