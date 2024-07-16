import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "store/slices/apiSlices";
import uiReducer from "store/slices/uiSlices";

export const store = configureStore({
  reducer: {
    api: apiReducer,
    ui: uiReducer,
  },
});
