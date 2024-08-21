// apiAction.js
import axios from "axios";
import {
  setApiResponse,
  setApiStatus,
  setApiStatusCode,
  setApiResponseTime,
  setApimethod,
} from "store/slices/apiSlices";
import host from "assets/json/host.json";

export const callAPI = (apiPath, params, environment, method) => async(dispatch)=> {
  switch (method) {
    case "get":
      return getapi(apiPath, params, environment)(dispatch);  // Execute the returned function immediately
    case "post":
     

      return  postapi(apiPath,params,environment)(dispatch);
    case "put":
      return  putapi(apiPath,params,environment)(dispatch);
    case "delete":
      return  deleteapi(apiPath,params,environment)(dispatch);
  }
};

const getapi = (apiPath, params, environment) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: "loading", environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${
      host.hostPostEnv
    }${apiPath}`;
    apiFullUrl += Object.entries(params)
      .map(([key, value], idx) => `${idx === 0 ? "?" : "&"}${key}=${value}`)
      .join("");

    const resp = await axios.get(apiFullUrl);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    dispatch(
      setApiResponse({ path: apiPath, response: resp.data, environment })
    );

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: resp.status, environment })
    );

    dispatch(setApimethod({ path: apiPath, method: "get", environment }));

    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    // Check if the response contains the word 'Error'
    const responseString = JSON.stringify(resp.data).toLowerCase();
    if (responseString.includes("error:")) {
      dispatch(setApiStatus({ path: apiPath, status: "Fail", environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: "Success", environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || "";
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(
          err.response.data
        )}`
      : err.message;

    dispatch(
      setApiResponse({
        path: apiPath,
        response: { error: errorMessage },
        environment,
      })
    );
    dispatch(
      setApiStatus({
        path: apiPath,
        status: `Fail ${errorCode}`.trim(),
        environment,
      })
    );
    dispatch(setApimethod({ path: apiPath, method: "get", environment }));

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: errorCode, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};


const postapi = (apiPath, params, environment, method) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: "loading", environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${
      host.hostPostEnv
    }${apiPath}`;
    apiFullUrl += Object.entries(params)
      .map(([key, value], idx) => `${idx === 0 ? "?" : "&"}${key}=${value}`)
      .join("");

    const resp = await axios({
      method: 'post',
      url: apiFullUrl,
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      },
    headers: {
        'Content-Type': 'application/json' 
      },
    });;

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    dispatch(
      setApiResponse({ path: apiPath, response: resp.data, environment })
    );

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: resp.status, environment })
    );

    dispatch(setApimethod({ path: apiPath, method: "post", environment }));

    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    // Check if the response contains the word 'Error'
    const responseString = JSON.stringify(resp.data).toLowerCase();
    if (responseString.includes("error:")) {
      dispatch(setApiStatus({ path: apiPath, status: "Fail", environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: "Success", environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || "";
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(
          err.response.data
        )}`
      : err.message;

    dispatch(
      setApiResponse({
        path: apiPath,
        response: { error: errorMessage },
        environment,
      })
    );
    dispatch(
      setApiStatus({
        path: apiPath,
        status: `Fail ${errorCode}`.trim(),
        environment,
      })
    );
    dispatch(setApimethod({ path: apiPath, method: "post", environment }));

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: errorCode, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};



const putapi = (apiPath, params, environment, method) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: "loading", environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${
      host.hostPostEnv
    }${apiPath}`;
    apiFullUrl += Object.entries(params)
      .map(([key, value], idx) => `${idx === 0 ? "?" : "&"}${key}=${value}`)
      .join("");

    const resp = await axios({
      method: 'put',
      url: apiFullUrl,
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      },
    headers: {
        'Content-Type': 'application/json' 
      },
    });;

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    dispatch(
      setApiResponse({ path: apiPath, response: resp.data, environment })
    );

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: resp.status, environment })
    );

    dispatch(setApimethod({ path: apiPath, method: "put", environment }));

    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    // Check if the response contains the word 'Error'
    const responseString = JSON.stringify(resp.data).toLowerCase();
    if (responseString.includes("error:")) {
      dispatch(setApiStatus({ path: apiPath, status: "Fail", environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: "Success", environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || "";
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(
          err.response.data
        )}`
      : err.message;

    dispatch(
      setApiResponse({
        path: apiPath,
        response: { error: errorMessage },
        environment,
      })
    );
    dispatch(
      setApiStatus({
        path: apiPath,
        status: `Fail ${errorCode}`.trim(),
        environment,
      })
    );
    dispatch(setApimethod({ path: apiPath, method: "put", environment }));

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: errorCode, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};

const deleteapi = (apiPath, params, environment, method) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: "loading", environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${
      host.hostPostEnv
    }${apiPath}`;
    apiFullUrl += Object.entries(params)
      .map(([key, value], idx) => `${idx === 0 ? "?" : "&"}${key}=${value}`)
      .join("");

    const resp = await axios({
      method: 'delete',
      url: apiFullUrl,
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      },
    headers: {
        'Content-Type': 'application/json' 
      },
    });;

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    dispatch(
      setApiResponse({ path: apiPath, response: resp.data, environment })
    );

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: resp.status, environment })
    );

    dispatch(setApimethod({ path: apiPath, method: "delete", environment }));

    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    // Check if the response contains the word 'Error'
    const responseString = JSON.stringify(resp.data).toLowerCase();
    if (responseString.includes("error:")) {
      dispatch(setApiStatus({ path: apiPath, status: "Fail", environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: "Success", environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || "";
    const errorMessage = err.response
      ? `${errorCode} ${err.response.statusText}: ${JSON.stringify(
          err.response.data
        )}`
      : err.message;

    dispatch(
      setApiResponse({
        path: apiPath,
        response: { error: errorMessage },
        environment,
      })
    );
    dispatch(
      setApiStatus({
        path: apiPath,
        status: `Fail ${errorCode}`.trim(),
        environment,
      })
    );
    dispatch(setApimethod({ path: apiPath, method: "delete", environment }));

    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: errorCode, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};

