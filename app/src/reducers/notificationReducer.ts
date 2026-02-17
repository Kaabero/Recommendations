import { createSlice } from "@reduxjs/toolkit";
import { NewNotification } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: NewNotification = {
  text: "",
  type: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<NewNotification>) {
      return action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
