import { createSlice } from '@reduxjs/toolkit';
import API from 'assets/json/API.json';

const initialState = {
  responses: { SIT: {}, PPM: {}, AAT: {} },
  status: { SIT: {}, PPM: {}, AAT: {} },
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
    updateApiParams: (state, action) => {
      const { path, params } = action.payload;
      state.params[path] = params;
    },
    setSelectedEnvironments: (state, action) => {
      state.selectedEnvironments = action.payload;
    }
  }
});

export const { setApiResponse, setApiStatus, updateApiParams, setSelectedEnvironments } = apiSlice.actions;
export default apiSlice.reducer;
