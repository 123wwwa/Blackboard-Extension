import styled from '@emotion/styled'
import { useEffect, useState } from 'react';
import {Todo} from 'type'

const Container = styled.div<any>`
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

function TodoCard({color, content, course_name, date, linkcode}: Todo) {
  const [remainingTime, setRemainingTime] = useState<Date>(new Date(0));
  useEffect(()=>{
    setInterval(()=>{
      setRemainingTime(new Date(date-Date.now()))
    },1000)
  },[])
  return (
    <Container color={color}>
      <Content>
        <Title>{content}</Title>
        <DateText>{new Date(date).toISOString().replace("T", " ").replace(/\..*/, '')}</DateText>
      </Content>

      <DueDateContainer>
        <DueDateText>{new Date(remainingTime).getDay()} Days</DueDateText>
        <DueDateText>{remainingTime.getHours()}:{remainingTime.getMinutes()}:{remainingTime.getSeconds()}</DueDateText>
      </DueDateContainer>
      
      <TrashIcon src={chrome.runtime.getURL("public/icons/icon-trash.png")} />
    </Container>
  )
}

export default TodoCard;