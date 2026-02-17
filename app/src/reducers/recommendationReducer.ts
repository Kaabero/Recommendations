import { createSlice } from "@reduxjs/toolkit";
import { RecommendationType } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: RecommendationType[] = [];

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    createRecommendation(state, action: PayloadAction<RecommendationType>) {
      state.push(action.payload);
    },
    setRecommendations(state, action: PayloadAction<RecommendationType[]>) {
      return action.payload;
    },
    like(state, action: PayloadAction<RecommendationType>) {
      const id = action.payload.id;
      const recommendationToChange = state.find((r) => r.id === id);
      if (recommendationToChange) {
        const changedRecommendation = {
          ...recommendationToChange,
          likes: (recommendationToChange.likes += 1),
        };

        state.map((r) => (r.id !== id ? r : changedRecommendation));
      }
      return state;
    },
    remove(state, action: PayloadAction<RecommendationType>) {
      const id = action.payload.id;
      return state.filter((r) => r.id !== id);
    },
  },
});

export const { createRecommendation, setRecommendations, like, remove } =
  recommendationSlice.actions;
export default recommendationSlice.reducer;
