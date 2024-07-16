import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAPILoading: 0,
};

export const uiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    startAPIRequest: (state) => {
      state.isAPILoading += 1;
    },
    stopAPIRequest: (state) => {
      state.isAPILoading -= 1;
    },
  },
});

export const { startAPIRequest, stopAPIRequest } = uiSlice.actions;

export default uiSlice.reducer;
