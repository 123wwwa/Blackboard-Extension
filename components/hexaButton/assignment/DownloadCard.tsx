import React, { useState, useCallback, memo } from 'react';
import styled from '@emotion/styled';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Checkbox from '~components/common/Checkbox';
import Menu from '~components/common/Menu';
import type { Assignment, FileUrl } from '~shared/types/blackboardTypes';
import useUserStateStore, { addCheckedFile, removeCheckedFile } from '~shared/stores/userStateStore';

const Container = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 20px;
  background-color: ${(props) => props.color || "#F5F5F5"};
  border-radius: 10px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-basis: 60%;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`;

const DownloadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 4px 2px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: rgba(28, 25, 23, 0.35);
  }
`;

type Props = {
  item?: Assignment;
};

const DownloadCard: React.FC<Props> = memo(({ item }) => {
  const [show, setShow] = useState(false);
  const { checkedFiles } = useUserStateStore();
  const isChecked = useCallback(
    (file: FileUrl) => checkedFiles.some((checkedFile) => checkedFile.fileURL === file.fileURL),
    [checkedFiles]
  );

  const toggleCheck = useCallback((file: FileUrl, checked: boolean) => {
    if (checked) {
      addCheckedFile(file);
    } else {
      removeCheckedFile(file);
    }
  }, []);

  return (
    <Container color={"#E9E9E9"}>
      <InnerContainer>
        <Content onClick={() => window.open(item?.url, "_blank")}>
          <Title>{item?.Name}</Title>
        </Content>
        <Menu show={show} onChange={setShow}>
          <Menu.Target>
            <DownloadWrapper>
              <FontAwesomeIcon icon={faDownload} opacity={0.4} />
            </DownloadWrapper>
          </Menu.Target>
          <Menu.Dropdown>
            {item?.Assignment_Files?.map((file) => (
              <Menu.MenuItem
                key={file.fileURL}
                leftIcon={<Checkbox checked={isChecked(file)} onClick={() => toggleCheck(file, !isChecked(file))} />}
                rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} onClick={() => window.open(file.fileURL, "_blank")} />}
              >
                <p>{file.fileName}</p>
              </Menu.MenuItem>
            ))}
          </Menu.Dropdown>
        </Menu>
      </InnerContainer>
    </Container>
  );
});

export default DownloadCard;