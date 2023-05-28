/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { Todo } from "type";
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../../features/store';
import { addTodoItem, selectTodoList } from "../../features/lecture_reducer";
const waitForElm = () => {
    return new Promise((resolve) => {
        if (document.body) {
            return resolve(document.body);
        }

        const observer = new MutationObserver((mutations) => {
            if (document.body) {
                resolve(document.body);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};
const Child = (props: { data: Todo }) => {
    const dispatch = useDispatch(); 
    const updateTodo = async (json: any) => {
        console.log(json);
        if(!json.studentHomeData) return window.close();
        if(json.status !== "success") return window.close();
        let homeworklist: any[] = json.studentHomeData.upcoming;
        if(!homeworklist) return window.close();
        if(homeworklist.length === 0) return window.close();
        let todoList = useSelector(selectTodoList);
        // const prevTodoList = todoList;
        // const addedHomeworkLength = homeworklist.length;
        homeworklist.forEach((homework: any) => {
            let todo: Todo = {
                content: homework.assignmentName,
                date: new Date(homework.displayDate).getTime(),
                color: "#E5E5E5",
            }
            console.log(todo);
            //addTodoItem(dispatch)(todo);
        });
        // window.chrome.runtime.sendMessage({ action: "mylab", json: homeworklist },
        //     (response) => {
        //         //window.close();
        //     }
        // );
        // wait for Item to add to store
    }
    useEffect(() => {
        updateTodo(props.data);
    }, [dispatch])
    return (<></>)
}
waitForElm().then((body) => {
    let json = JSON.parse(document.body.innerText);
    const rootEl = document.createElement("div");
    rootEl.id = "root-container";
    document.body.prepend(rootEl);
    //const container = document.body as HTMLElement;
    const root: any = createRoot(rootEl!);

    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <Child data ={json}/>
            </Provider>
        </React.StrictMode>
    )
});

