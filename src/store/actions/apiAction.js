// apiAction.js
import axios from "axios";
import { setApiResponse, setApiStatus, setApiStatusCode, setApiResponseTime } from "store/slices/apiSlices";
import host from "assets/json/host.json";

export const callAPI = (apiPath, params, environment) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: 'loading', environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${host.hostPostEnv}${apiPath}`;
    apiFullUrl += Object.entries(params).map(([key, value], idx) => 
      `${idx === 0 ? '?' : '&'}${key}=${value}`
    ).join('');
    
    const resp = await axios.get(apiFullUrl);

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    dispatch(setApiResponse({ path: apiPath, response: resp.data, environment }));
    dispatch(setApiStatusCode({ path: apiPath, statusCode: resp.status, environment }));
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    // Check if the response contains the word 'Error'
    const responseString = JSON.stringify(resp.data).toLowerCase();
    if (responseString.includes('error:')) {
      dispatch(setApiStatus({ path: apiPath, status: 'Fail', environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: 'Success', environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || '';
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(err.response.data)}`
      : err.message;
    
    dispatch(setApiResponse({ path: apiPath, response: { error: errorMessage }, environment }));
    dispatch(setApiStatus({ path: apiPath, status: `Fail ${errorCode}`.trim(), environment }));
    dispatch(setApiStatusCode({ path: apiPath, statusCode: errorCode, environment }));
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};