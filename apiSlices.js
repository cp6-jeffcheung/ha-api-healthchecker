// apiSlices.js
import { createSlice } from "@reduxjs/toolkit";
import API from "assets/json/API.json";

const initialState = {
  responses: { SIT: {}, DEVQA: {}, AAT: {} },
  status: { SIT: {}, DEVQA: {}, AAT: {} },
  statusCodes: { SIT: {}, DEVQA: {}, AAT: {} },
  responseTimes: { SIT: {}, DEVQA: {}, AAT: {} },
  SIT: {
    params: API.apis.reduce(
      (acc, api) => ({ ...acc, [api.path]: api.SIT || {} }),
      {}
    )
  },
  DEVQA: {
    params: API.apis.reduce(
      (acc, api) => ({ ...acc, [api.path]: api.DEVQA || {} }),
      {}
    )
  }
,
AAT: {
  params: API.apis.reduce(
    (acc, api) => ({ ...acc, [api.path]: api.AAT || {} }),
    {}
  )
}
,
  
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
  },
});

export const {
  setApiResponse,
  setApiStatus,
  setApiStatusCode,
  updateApiParams,
  setSelectedEnvironments,
  setApiResponseTime,
} = apiSlice.actions;
export default apiSlice.reducer;
