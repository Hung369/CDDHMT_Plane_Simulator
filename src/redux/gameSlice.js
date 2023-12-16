import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPlaying: false,
  score: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    getScore: (state, action) => {
      state.score += action.payload;
    },
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetScore: (state, action) => {
      state.score = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getScore, setPlaying, resetScore } = gameSlice.actions;

export default gameSlice.reducer;
