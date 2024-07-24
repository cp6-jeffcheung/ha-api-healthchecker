import axios from "axios";
import { setApiResponse, setApiStatus } from "store/slices/apiSlices";
import host from "assets/json/host.json";

export const callAPI = (apiPath, params, environment) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: 'loading', environment }));
  
  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${host.hostPostEnv}${apiPath}`;
    apiFullUrl += Object.entries(params).map(([key, value], idx) => 
      `${idx === 0 ? '?' : '&'}${key}=${value}`
    ).join('');
    
    const resp = await axios.get(apiFullUrl);
    
    if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);

    dispatch(setApiResponse({ path: apiPath, response: resp.data, environment }));
    dispatch(setApiStatus({ path: apiPath, status: 'Success', environment }));
  } catch (err) {
    console.log("Error: ", err);
    const errorCode = err.response?.status || '';
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(err.response.data)}`
      : err.message;
    
    dispatch(setApiResponse({ path: apiPath, response: { error: errorMessage }, environment }));
    dispatch(setApiStatus({ path: apiPath, status: `Fail ${errorCode}`.trim(), environment }));
  }
};