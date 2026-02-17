import { createSlice } from "@reduxjs/toolkit";
import { Service } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: Service[] = [];

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<Service[]>) {
      return action.payload;
    },
  },
});

export const { setServices } = serviceSlice.actions;
export default serviceSlice.reducer;
