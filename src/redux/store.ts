import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authSlice from "@/redux/reducers/authSlice.ts";
import userSlice from "@/redux/reducers/userSlice.ts";
import screenPropertySlice from "./reducers/screenPropertySlice";
import conversationSlice from "./reducers/conversationSlice";
import notificationSlice from "./reducers/notificationSlice";
import postSlice from "./reducers/postSlice";
import communitySlice from "./reducers/communitySlice";
import adminSlice from "./reducers/adminSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    user: userSlice,
    screenProperty: screenPropertySlice,
    conversation: conversationSlice,
    notification: notificationSlice,
    post: postSlice,
    community: communitySlice,
    admin: adminSlice
});

export const store = configureStore({
    reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>