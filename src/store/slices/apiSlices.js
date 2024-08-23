// apiSlices.js
import { createSlice } from "@reduxjs/toolkit";
import API from "assets/json/API.json";

const initialState = {
  responses: { SIT: {}, DEVQA: {}, AAT: {} },
  status: { SIT: {}, DEVQA: {}, AAT: {} },
  statusCodes: { SIT: {}, DEVQA: {}, AAT: {} },
  responseTimes: { SIT: {}, DEVQA: {}, AAT: {} },
  params: API.apis.reduce((acc, api) => ({
    ...acc,
    [api.path]: {
      SIT: api.params.SIT || {},
      DEVQA: api.params.DEVQA || {},
      AAT: api.params.AAT || {},
    },
  }), {}),
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
      const { path, statusCode, environment } = action.payload;
      state.statusCodes[environment][path] = statusCode;
    },
    updateApiParams: (state, action) => {
      const { path, params, environment } = action.payload;
      state.params[path][environment] = params;
    },
    setSelectedEnvironments: (state, action) => {
      state.selectedEnvironments = action.payload;
    },
    setApiResponseTime: (state, action) => {
      const { path, responseTime, environment } = action.payload;
      state.responseTimes[environment][path] = responseTime;
    },
    resetApiData: (state) => {
      state.responses = {
        SIT: {},
        DEVQA: {},
        AAT: {},
      };
      state.statusCodes = {
        SIT: {},
        DEVQA: {},
        AAT: {},
      };
      state.responseTimes = {
        SIT: {},
        DEVQA: {},
        AAT: {},
      };
      state.selectedEnvironments = [];
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
  resetApiData,
} = apiSlice.actions;
export default apiSlice.reducer;