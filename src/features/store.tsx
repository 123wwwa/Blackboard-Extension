import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";

import { lectureSlice } from "./lecture_reducer";
export const rootReducer = combineReducers({
    lectureSlice: lectureSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export default store;
