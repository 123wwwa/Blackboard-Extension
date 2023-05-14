/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { Todo } from "type";
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../../features/store';
import { addTodoItem } from "../../features/lecture_reducer";
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
    const updateTodo = (json: any) => {
        let homeworklist: any[] = json.studentHomeData.upcoming;
        homeworklist.forEach((homework: any) => {
            let todo: Todo = {
                content: homework.assignmentName,
                date: new Date(homework.displayDate).getTime(),
                color: "#E5E5E5",
            }
            addTodoItem(dispatch)(todo);
        });
        window.close();
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

