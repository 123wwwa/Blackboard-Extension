import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";

import { lectureSlice } from "./lecture_reducer";
import { settingSlice } from "./setting_reducer";
export const rootReducer = combineReducers({
    lectureSlice: lectureSlice.reducer,
    settingSlice: settingSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

