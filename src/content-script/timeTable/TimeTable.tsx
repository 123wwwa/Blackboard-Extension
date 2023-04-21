/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Lecture, ShapedLecture} from '../../type'
const HeadHeight = 30;
const TableHeight = 45;
const TableWidth = 80;
const colorlist = ["#eff9cc", "#dee8f6", "#ffe9e9", "#ffedda", "#dcf2e9", "#dceef2", "#fff8cc", "#ffe9e9"];
interface LectureList {
  [key: string]: Lecture;
}
const RenderTableDay = () => {
  const [lectureList, setLectureList] = useState<LectureList>({});
  const [isLectureListLoaded, setIsLectureListLoaded] = useState(false);
  const [shapedLectureList, setShapedLectureList] = useState<ShapedLecture[][]>([]);
  const [logoURL, setLogoURL] = useState<string>("");
  
  const loadTimeTable = () => {
    setLogoURL(chrome.runtime.getURL("public/assets/HeXA_logo.png"));
    window.chrome.storage.sync.get(['lectureInfo'], (res) => {
      if (res.lectureInfo == undefined && res.lectureInfo == null) {
        alert("블랙보드에 접속하여 강좌정보를 가져오세요!(현재 접속중일경우 새로고침(F5))");
      }
      var resLecturelist:LectureList = JSON.parse(res.lectureInfo);
      setLectureList(resLecturelist);
      if (!resLecturelist || (Object.keys(resLecturelist).length === 0 && Object.getPrototypeOf(resLecturelist) === Object.prototype)) {
        alert("블랙보드에 접속하여 강좌정보를 가져오세요!(현재 접속중일경우 새로고침(F5))");
      }
      var l: ShapedLecture[][] = [[], [], [], [], []];
      var key: string;
      var i = 0;
      
      for (key in resLecturelist) {
        var item:any = resLecturelist[key];
        i += 1;
        for (var c = 0; c < 3; c++) {
          if (item["timeplace" + c]) {
            var newItem:ShapedLecture = {
              "name": item["name"],
              "professor": item["professor"],
              "time": item["time"],
              "link": item["link"],
              "color": colorlist[i],
              "timeplace": item["timeplace" + c]
            }
            l[item["timeplace" + c].day].push(newItem);

          }
        }
      }
      setShapedLectureList(l)
      setIsLectureListLoaded(true);

    })
  }

  const LectureDiv = (props: any) => {
    const marginTop: number = (props.item["timeplace"].start - (9 * 12)) / 12 * (TableHeight + 2) + (HeadHeight + 3); // minus 9 hour to start from 9 
    // add 2 to consider margin.
    const height: number = (props.item["timeplace"].end - props.item["timeplace"].start) / 12 * (TableHeight + 2);
    const place = props.item["timeplace"].place;
    const link = props.item["link"];
    return (
      <div>
        <div
          id="lectureDiv"
          style={{
            backgroundColor: props.item["color"],
            marginTop: marginTop + 'px',
            height: height + 'px',
          }}
          onClick={() => {
            window.open(link, "_blank");
          }}>
          <span id="lectureName">{props.item["name"]}</span>
          <span id="lecturePlace">{place}</span>
        </div>
      </div>
    )
  }
  useEffect(() => {
    loadTimeTable();
  }, [])
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
        width: "100%",

      }}>
      <RenderTableDay />
    </div>

  )
}

export default TimeTable;

