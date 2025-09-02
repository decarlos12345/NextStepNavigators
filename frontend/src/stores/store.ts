import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import coursesSlice from "./courses/coursesSlice";
import messagesSlice from "./messages/messagesSlice";
import notesSlice from "./notes/notesSlice";
import optionsSlice from "./options/optionsSlice";
import questionsSlice from "./questions/questionsSlice";
import quizzesSlice from "./quizzes/quizzesSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
courses: coursesSlice,
messages: messagesSlice,
notes: notesSlice,
options: optionsSlice,
questions: questionsSlice,
quizzes: quizzesSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
