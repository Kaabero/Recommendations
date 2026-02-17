import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const modalSlice = createSlice({
  name: "modal",
  initialState: false,
  reducers: {
    setIsOpen(state, action: PayloadAction<boolean>) {
      return action.payload;
    },
    
  },
});

export const { setIsOpen } = modalSlice.actions;
export default modalSlice.reducer;