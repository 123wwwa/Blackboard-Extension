import styled from "@emotion/styled";
import AssignmentCard from "./AssignmentCard";
import React, { useEffect, useCallback, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadCard from "./DownloadCard";
import useLectureStore from "~shared/stores/lectureStore";
import { setCheckedFiles } from "~shared/stores/userStateStore";
import { loadLectureList } from "~features/events/lectureListUtils";

const ListContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 7px;
    height: 10px;
    background-color: white;
    border-radius: 8px;
  }
`;

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 14px;
  width: 100%;
  height: 330px;
`;

const MemoizedAssignmentCard = memo(AssignmentCard);
const MemoizedDownloadCard = memo(DownloadCard);

function AssignmentList({ activeLectureId, setActiveLectureId }) {
  const { lectureObject } = useLectureStore();

  const handleGoBack = useCallback(() => {
    setActiveLectureId(null);
    setCheckedFiles([]);
  }, [setActiveLectureId]);

  useEffect(() => {
    loadLectureList();
  }, []);

  const sortedAssignments = useCallback(() => {
    if (activeLectureId && lectureObject[activeLectureId].assignment) {
      return [...lectureObject[activeLectureId].assignment].sort((a, b) => parseInt(b.Due_Date) - parseInt(a.Due_Date));
    }
    return [];
  }, [activeLectureId, lectureObject]);

  return (
    <RootContainer>
      {activeLectureId && (
        <header onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          {lectureObject[activeLectureId].name}
        </header>
      )}
      <ListContainer>
        {!activeLectureId ? (
          Object.entries(lectureObject).map(([key, value]) =>
            value.isLecture ? (
              <MemoizedAssignmentCard
                key={key}
                item={value}
                onSelect={() => setActiveLectureId(key)}
              />
            ) : null
          )
        ) : (
          sortedAssignments().map((item) => <MemoizedDownloadCard key={item.content_id} item={item} />)
        )}
      </ListContainer>
    </RootContainer>
  );
}

export default AssignmentList;
