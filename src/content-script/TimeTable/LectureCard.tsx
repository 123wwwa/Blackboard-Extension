import styled from '@emotion/styled';

const LectureContent = styled.div<{ backgroundColor?: string }>`
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  overflow: hidden;
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
const HeadHeight = 30;
type Props = {
    item: any;
    tableHeight: number;
    tableWidth: number;
}

export const LectureCard = ({item, tableHeight, tableWidth}: Props) => {
    const start = Number(item?.timeplace?.start);
    const end = Number(item?.timeplace?.end);
    const top = (start - (9 * 12)) / 12 * tableHeight + HeadHeight;
    const height = (end - start) / 12 * tableHeight;
    if (!Number.isFinite(top) || !Number.isFinite(height) || height <= 0) return null;
    const place = item.timeplace.place;
    const link = item.link;
    return (
        <div
            style={{
                position: "absolute",
                top,
                left: 0,
                width: tableWidth,
                height,
                zIndex: 5,
                boxSizing: "border-box",
            }}
        >
            <LectureContent
                backgroundColor={item.color || "#fff8cc"}
                onClick={() => {
                    if (link) window.open(link, "_blank");
                }}>
                <LectureTextArea>
                    <LectureName>{item.name}</LectureName>
                    <LecturePlace>{place}</LecturePlace>
                </LectureTextArea>
            </LectureContent>
        </div>
    )
}