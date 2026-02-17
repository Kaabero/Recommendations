import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../../types";

const initialState: User[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      return action.payload;
    },
    createUser(state, action: PayloadAction<User>) {
      state.push(action.payload);
    },
  },
});

export const { setUsers, createUser } = usersSlice.actions;
export default usersSlice.reducer;
