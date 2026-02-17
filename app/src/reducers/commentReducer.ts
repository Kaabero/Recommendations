import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Comment } from "../../../types";

const initialState: Comment[] = [];

const commentSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      return action.payload;
    },
    createComment(state, action: PayloadAction<Comment>) {
      state.push(action.payload);
    },
  },
});

export const { setComments, createComment } = commentSlice.actions;
export default commentSlice.reducer;