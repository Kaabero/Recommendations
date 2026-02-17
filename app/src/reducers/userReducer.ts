import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendationType } from "../../../types";
import { User } from "../../../types";

const initialState: User = {
  id: 0,
  token: "",
  username: "",
  admin: false,
  disabled: true,
  favouriteRecommendations: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
    clearUser(state, action: PayloadAction<null>) {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
