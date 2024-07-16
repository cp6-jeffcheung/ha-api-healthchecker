import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  responses: [],
};

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setResponses: (state, { payload }) => {
      state.responses = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setResponses } = apiSlice.actions;

export default apiSlice.reducer;
