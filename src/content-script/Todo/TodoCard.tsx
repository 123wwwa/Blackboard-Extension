import styled from '@emotion/styled'

type TodoCardProps = {
  color?: string;
};

const Container = styled.div<TodoCardProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 63px;
  padding: 15px 20px;
  background-color: ${props => props.color || '#F5F5F5'};
  border-radius: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  font-size: 14px;
  max-width: 300px;
  margin: 0
`;

const DateText = styled.p`
  font-size: 12px;
  font-weight: 400;
`;

const DueDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DueDateText = styled(DateText)`
  color: #DC2626;
`;

const TrashIcon = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

function TodoCard({ color }: TodoCardProps) {
  return (
    <Container color={color}>
      <Content>
        <Title>System Programming: Assignment 1</Title>
        <DateText>2023-04-04 23:59</DateText>
      </Content>

      <DueDateContainer>
        <DueDateText>0 Days</DueDateText>
        <DueDateText>04:05:07</DueDateText>
      </DueDateContainer>
      
      <TrashIcon src={chrome.runtime.getURL("public/icons/icon-trash.png")} />
    </Container>
  )
}

export default TodoCard;