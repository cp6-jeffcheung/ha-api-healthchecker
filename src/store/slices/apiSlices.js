// apiSlices.js
import { createSlice } from '@reduxjs/toolkit';
import API from 'assets/json/API.json';

const initialState = {
  responses: { SIT: {}, PPM: {}, AAT: {} },
  status: { SIT: {}, PPM: {}, AAT: {} },
  statusCodes: { SIT: {}, PPM: {}, AAT: {} },
  responseTimes: { SIT: {}, PPM: {}, AAT: {} },
  params: API.apis.reduce((acc, api) => ({ ...acc, [api.path]: api.params || {} }), {}),
  selectedEnvironments: ['SIT']
};

const apiSlice = createSlice({
  name: 'api',
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
    setApiStatusCode: (state, action) => { // Add this reducer
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
    setApiResponseTime: (state, action) => { // Add this reducer
      const { path, responseTime, environment } = action.payload;
      state.responseTimes[environment][path] = responseTime;
    }
  }
});

export const { setApiResponse, setApiStatus, setApiStatusCode, updateApiParams, setSelectedEnvironments, setApiResponseTime } = apiSlice.actions;
export default apiSlice.reducer;