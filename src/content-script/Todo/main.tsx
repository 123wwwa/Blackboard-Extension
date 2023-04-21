import React from 'react';
import { createRoot } from 'react-dom/client';
import Todo from './Todo';

const waitForElm = () => {
    return new Promise(resolve => {
        if (document.body) {
            return resolve(document.body);
        }

        const observer = new MutationObserver(mutations => {
            if (document.body) {
                resolve(document.body);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm().then(() => {
    const rootEl = document.createElement('div')
    rootEl.id = 'root-container'
    document.body.prepend(rootEl)
    //const container = document.body as HTMLElement;
    const root: any = createRoot(rootEl!);

    root.render(
        <React.StrictMode>
            <Todo />
        </React.StrictMode>
    )
})