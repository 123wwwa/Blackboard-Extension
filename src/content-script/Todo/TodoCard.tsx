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
  &:hover {
    filter: brightness(80%);
    cursor: pointer;
  }
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
  const [currentTime, setCurrentTime] = useState<Date>(new Date(Date.now()));
  useEffect(()=>{
    setInterval(()=>{
      setCurrentTime(new Date(Date.now()))
      setRemainingTime(new Date(date-Date.now()-(3240 * 10000)))
    },1000)
  },[])
  const getDayDiff = (date1: Date, date2: Date) => {
    return Math.floor((date1.getTime() - date2.getTime()) / 8.64e7);
  }
 
  return (
    <Container color={color}
    onClick={()=>{
      if(!linkcode) return;
      window.open(`https://blackboard.unist.ac.kr/webapps/calendar/launch/attempt/${linkcode}`, '_blank');
    }}>
      <Content>
        <Title >{content}</Title>
        <DateText>{new Date(date+(3240 * 10000)).toISOString().replace("T", " ").replace(/\..*/, '')}</DateText>
      </Content>

      <DueDateContainer>
        <DueDateText>{getDayDiff(new Date(date), currentTime)} Days</DueDateText>
        <DueDateText>{remainingTime.getHours().toString().padStart(2,'0')}:{remainingTime.getMinutes().toString().padStart(2,'0')}:{remainingTime.getSeconds().toString().padStart(2,'0')}</DueDateText>
      </DueDateContainer>
      
      <TrashIcon src={chrome.runtime.getURL("public/icons/icon-trash.png")} />
    </Container>
  )
}

export default TodoCard;