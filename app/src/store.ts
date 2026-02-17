import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./reducers/notificationReducer";
import recommendationReducer from "./reducers/recommendationReducer";
import serviceReducer from "./reducers/serviceReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";
import modalReducer from "./reducers/modalReducer";
import commentReducer from "./reducers/commentReducer"

const store = configureStore({
  reducer: {
    recommendations: recommendationReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer,
    services: serviceReducer,
    modal: modalReducer,
    comments: commentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
