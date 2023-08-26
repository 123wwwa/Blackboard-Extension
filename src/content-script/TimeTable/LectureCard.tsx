import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const LectureContent = styled.div<{ marginTop?: string, height?: string, backgroundColor?: string }>`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top:${props => props.marginTop};
  background-color: ${props => props.backgroundColor};
  height: ${props => props.height};
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
  font-size: 11px;
  `
const LecturePlace = styled.span`
  color:darkgray;
  font-weight: bold;
  font-size: 11px;
  `
const LectureDiv2 = styled.div<{width:number}>`
  position: absolute;
  width: ${props => props.width}px;
  border: 1px solid transparent;
  
  text-align: center;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `
const HeadHeight = 30;
type Props = {
    item: any;
    tableHeight: number;
    tableWidth: number;
}
export const LectureCard = ({item, tableHeight, tableWidth}: Props) => {
    const marginTop: number = (item["timeplace"].start - (9 * 12)) / 12 * (tableHeight) + (HeadHeight); // minus 9 hour to start from 9 
    const height: number = (item["timeplace"].end - item["timeplace"].start) / 12 * (tableHeight);
    const place = item["timeplace"].place;
    const link = item["link"];
    return (
        <LectureDiv2 width={tableWidth}>
            <LectureContent
                marginTop={marginTop.toString() + "px"}
                height={height.toString() + "px"}
                backgroundColor={item["color"]}

                onClick={() => {
                    window.open(link, "_blank");
                }}>
                <LectureTextArea>
                    <LectureName>{item["name"]}</LectureName>
                    <LecturePlace>{place}</LecturePlace>
                </LectureTextArea>
            </LectureContent>
        </LectureDiv2>

    )
}