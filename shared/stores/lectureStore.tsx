import create from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Assignment, BB_alarm, LectureObject, ShapedLecture, Todo } from '~shared/types/blackboardTypes';

// Define your store without destructuring set and get directly
export interface StoreState {
    lectureObject: LectureObject;
    shapedLectureList: ShapedLecture[][];
    isLectureLoaded: boolean;
    todoList: Todo[];
    deletedTodoList: Todo[];
    alarmList: BB_alarm[];
}
export interface StoreActions {
    setLectureObject: (lectureObject: LectureObject) => void;
    setShapedLectureList: (shapedLectureList: ShapedLecture[][]) => void;
    setLectureAssignment: (lectureID: string, assignment: Assignment) => void;
    setTodoList: (todoList: Todo[]) => void;
    addTodo: (todo: Todo) => void;
    addDeletedTodo: (todo: Todo) => void;
    resetDeletedTodo: () => void;
    setAlarmList: (alarms: BB_alarm[]) => void;
}
type UseStore = StoreState & StoreActions;
const store = (set, get) => ({
    lectureObject: {},
    shapedLectureList: [[], [], [], [], [], []],
    isLectureLoaded: false,
    todoList: [],
    deletedTodoList: [],
    alarmList: [],
    setLectureObject: (lectureObject: LectureObject) => set({ lectureObject: lectureObject }),
    setShapedLectureList: (shapedLectureList: ShapedLecture[][]) => set(state => ({ shapedLectureList, isLectureLoaded: true })),
    setLectureAssignment: (lectureID: string, assignment: Assignment) => {
        const lecture = get().lectureObject[lectureID];
        if (lecture) {
            set(state => ({
                lectureObject: {
                    ...state.lectureObject,
                    [lectureID]: {
                        ...lecture,
                        assignment: [...lecture.assignment, assignment]
                    }
                }
            }));
        }
    },
    setTodoList: (todoList: Todo[]) => set({ todoList }),
    addTodo: (todo: Todo) => set(state => ({ todoList: [...state.todoList, todo] })),
    addDeletedTodo: (todo: Todo) => set(state => ({ deletedTodoList: [...state.deletedTodoList, todo] })),
    resetDeletedTodo: () => set({ deletedTodoList: [] }),
    setAlarmList: (alarms: BB_alarm[]) => set({ alarmList: alarms }),
});

// Define your store with or without devtools
const useLectureStore = create<UseStore>(
   store
);
export const {
    setLectureObject, setShapedLectureList, setLectureAssignment, setTodoList, addTodo, addDeletedTodo, resetDeletedTodo, setAlarmList} = useLectureStore.getState()
export default useLectureStore
