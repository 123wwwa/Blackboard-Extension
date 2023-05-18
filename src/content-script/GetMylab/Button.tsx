/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, {useEffect} from 'react';
import styled from '@emotion/styled';
import { Todo } from 'type';
import { useDispatch } from 'react-redux';
import { addTodoItem } from '../../features/lecture_reducer';

const FixedButton = styled.button`
    position: fixed;
    right: 30px;
    bottom: 10px;
    font-size: 16px;
    font-family: Pretendard-Regular;
    z-index: 10000;
    width: 50px;
    height: 50px;
`;
export const Button = () => {
    const dispatch = useDispatch();
    const updateTodo = (homeworklist:any) => {
        homeworklist.forEach((homework: any) => {
            let todo: Todo = {
                content: homework.assignmentName,
                date: new Date(homework.displayDate).getTime(),
                color: "#E5E5E5",
            }
            addTodoItem(dispatch)(todo);
        });
    }
    useEffect(() => {
        // window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        //     console.log(message.json);
        //     if (message.action === "mylab") {
                
        //         updateTodo(message.json);
        //         sendResponse({ action: "mylab", status: "success" });
        //     }
        // });
    }, [dispatch]);
    const getFormattedDate = (date: Date, time: string) => {
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear().toString();
        // Create formatted date string
        let formattedDate = `${month}/${day}/${year}%20${time}`;
        return formattedDate;
        // time start: 00:00:00 end: 23:59:59
    }
    const openMylab = () => {
        let now = new Date();
        let twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
        let startDate = getFormattedDate(now, "00:00:00");
        let endDate = getFormattedDate(twoWeeksFromNow, "23:59:59");
        let url = `https://mylab.pearson.com/api/studenthome?requestType=studenthomedata&StartDate=${startDate}&EndDate=${endDate}`;
        window.open(url, "_blank");
    }
    return (<>
        <FixedButton onClick={openMylab}>마이랩 일정 연동</FixedButton>
    </>)
};
export default Button;