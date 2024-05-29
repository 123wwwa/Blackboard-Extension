import { addDeletedTodo, addTodo, setTodoList } from "~shared/stores/lectureStore";
import { getChromeStorage, getChromeStorageList, setChromeStorage, setChromeStorageList } from "../../shared/storage";
import type { Lecture, Todo, LectureObject } from "~shared/types/blackboardTypes";
import { sendToBackground } from "@plasmohq/messaging"
export const loadTodoList = async () => { // 스토리지에 저장된 과제 리스트를 불러옴
    let todoList: Todo[] = await getChromeStorageList("todoList");
    setTodoList(todoList);
};
export const resetDeletedTodoList = async () => { // 과제 리스트를 초기화
    await setChromeStorageList("deletedTodoList", []);
    await updateTodoList();
}
export const fetchWithCatch = async (url: string, header: string) => {
    try {
        var response = await fetch(url, JSON.parse(header));
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch (e) {
        return null;
    }
}
export const updateTodoList = async () => { // 과제 리스트를 업데이트
    let todoList: Todo[] = await getChromeStorageList("todoList");
    // todoList에 이미 있는 과제는 제거
    for (let key in todoList) {
        let todo: Todo = todoList[key];
        if (todo.linkcode) {
            todoList.splice(parseInt(key), 1);
        }
    }
    const fetchUrl =
        "https://blackboard.unist.ac.kr/webapps/calendar/calendarData/selectedCalendarEvents?start=" +
        Date.now() +
        "&end=2147483647000";
    const fetchData = await fetchWithCatch(fetchUrl, "{}");
    if (!fetchData || fetchData.length == 0) { // 데이터를 가져오지 못한 경우
        loadTodoList();
        return;
    }
    let lectureObject:LectureObject= await getChromeStorage("lectureInfo", {});
    let deletedTodoList: Todo[] = await getChromeStorageList("deletedTodoList");
    // todoList에 이미 있는 과제는 제거
    for (let key in deletedTodoList) {
        let deletedTodo: Todo = deletedTodoList[key];
        for (let key2 in fetchData) {
            if (deletedTodo.linkcode == fetchData[key2]["id"]) {
                fetchData.splice(parseInt(key2), 1);
            }
        }
    }
    for (let key in fetchData) {
        if (fetchData[key]["calendarName"] == "Personal" || fetchData[key]["calendarName"].includes("ULP")) { // 개인 일정이거나 리더싶 프로그램인 경우 제외
            continue;
        }
        let lectureColor: string = "";
        let korLectureName: string = "";
        Object.entries(lectureObject).forEach(([key2, value]) => { // 강의 리스트를 돌면서 강의 이름과 색상을 가져옴
            let lecture: Lecture = value;
            if (lecture.calendarId == fetchData[key]["calendarId"]) {
                lectureColor = lecture.color;
                korLectureName = lecture.name;
            }
        });
        let newStartString = fetchData[key]["start"];
        let newDate = new Date(newStartString);
        let assignName = fetchData[key]["title"];
        let link = "";
        if (fetchData[key]["calendarName"] !== "Personal") {
            assignName = korLectureName + ": " + assignName;
            link = fetchData[key]["id"];
        }
        let todo: Todo = {
            course_name: fetchData[key]["calendarName"],
            content: assignName,
            date: newDate.getTime(),
            color: lectureColor,
            linkcode: link,
            userCreated: false,
        };
        if (todo.color != "") {
            todoList.push(todo);
        }
    }
    let newTodoList: Todo[] = [];
    for (let key in todoList) { // 중복된 과제를 제거
        let todo: Todo = todoList[key];
        let isDuplicated = false;
        for (let key2 in newTodoList) {
            let newTodo: Todo = newTodoList[key2];
            if (isTodoEqual(todo, newTodo)) {
                isDuplicated = true;
            }
        }
        if (!isDuplicated) {
            newTodoList.push(todo);
        }
    }
    setChromeStorageList("todoList", newTodoList);
    setTodoList(newTodoList);
}
export const deleteTodo = async (todo: Todo) => {
    if (!todo.userCreated) { // 사용자가 만든 과제가 아닌 경우 삭제된 과제 리스트에 추가
        addDeletedTodo(todo);
        let deletedTodoList: Todo[] = await getChromeStorageList("deletedTodoList");
        deletedTodoList.push(todo);
        setChromeStorageList("deletedTodoList", deletedTodoList);
    }
    let todoList: Todo[] = await getChromeStorageList("todoList");
    let newTodoList: Todo[] = [];
    //delete todo
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (isTodoEqual(todo, newTodo)) {
            continue;
        }
        newTodoList.push(newTodo);
    }
    setChromeStorageList("todoList", newTodoList);
    setTodoList(newTodoList);
};
const isTodoEqual = (todo1: Todo, todo2: Todo) => {  // 이름과 날짜 또는 링크가 같은 경우 중복된 과제로 판단
    return (todo1.content == todo2.content && todo1.date == todo2.date) || (todo1.linkcode && todo1.linkcode == todo2.linkcode);
}
export const addTodoItem = async (todo: Todo) => {
    // check if duplicated
    let todoList: Todo[] = await getChromeStorageList("todoList");
    console.log(todoList);
    for (let key in todoList) {
        let newTodo: Todo = todoList[key];
        if (isTodoEqual(todo, newTodo)) {
            console.log("duplicated todo Item");
            return;
        }
    }
    addTodo(todo);
    todoList.push(todo);
    console.log(todoList);
    setChromeStorageList("todoList", todoList);
};
export const postTodoList = async (todoList: Todo[]) => {
    const res = await sendToBackground({
        // @ts-ignore
        name: "calendar", // ignore ts error
        body: {
            todoList: todoList
        }
    });
    return res;
}