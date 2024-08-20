// apiSlices.js
import { createSlice } from "@reduxjs/toolkit";
import API from "assets/json/API.json";

const initialState = {
  responses: { SIT: {}, DEVQA: {}, AAT: {} },
  status: { SIT: {}, DEVQA: {}, AAT: {} },
  statusCodes: { SIT: {}, DEVQA: {}, AAT: {} },
  responseTimes: { SIT: {}, DEVQA: {}, AAT: {} },
  params: API.apis.reduce(
    (acc, api) => ({ ...acc, [api.path]: api.params || {} }),
    {}
  ),
  selectedEnvironments: ["SIT"],
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setApiResponse: (state, action) => {
      const { path, response, environment } = action.payload;
      state.responses[environment][path] = response;
    },
    setApiStatus: (state, action) => {
      const { path, status, environment } = action.payload;
      state.status[environment][path] = status;
    },
    setApiStatusCode: (state, action) => {
      // Add this reducer
      const { path, statusCode, environment } = action.payload;
      state.statusCodes[environment][path] = statusCode;
    },
    updateApiParams: (state, action) => {
      const { path, params } = action.payload;
      state.params[path] = params;
    },
    setSelectedEnvironments: (state, action) => {
      state.selectedEnvironments = action.payload;
    },
    setApiResponseTime: (state, action) => {
      // Add this reducer
      const { path, responseTime, environment } = action.payload;
      state.responseTimes[environment][path] = responseTime;
    },
    resetResponses: (state) => {
      state.responses = { SIT: {}, DEVQA: {}, AAT: {} };
      state.status = { SIT: {}, DEVQA: {}, AAT: {} };
      state.statusCodes = { SIT: {}, DEVQA: {}, AAT: {} };
      state.responseTimes = { SIT: {}, DEVQA: {}, AAT: {} };
    },
  },
});

export const {
  setApiResponse,
  setApiStatus,
  setApiStatusCode,
  updateApiParams,
  setSelectedEnvironments,
  setApiResponseTime,
  resetResponses
} = apiSlice.actions;
export default apiSlice.reducer;
