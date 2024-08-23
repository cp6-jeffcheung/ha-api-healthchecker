import axios from "axios";
import {
  setApiResponse,
  setApiStatus,
  setApiStatusCode,
  setApiResponseTime,
} from "store/slices/apiSlices";
import host from "assets/json/host.json";

export const callAPI = (apiPath, params, environment) => async (dispatch) => {
  dispatch(setApiStatus({ path: apiPath, status: "loading", environment }));
  const startTime = Date.now();

  try {
    let apiFullUrl = `${host.hostPreEnv}${environment.toLowerCase()}${
      host.hostPostEnv
    }${apiPath}`;
    
    const environmentParams = params;
    
    if (environmentParams && typeof environmentParams === 'object' && Object.keys(environmentParams).length > 0) {
      apiFullUrl += Object.entries(environmentParams)
        .map(([key, value], idx) => `${idx === 0 ? "?" : "&"}${key}=${value}`)
        .join("");
    }

    const resp = await axios.get(apiFullUrl, { 
      responseType: 'text',
      transformResponse: [(data) => data],
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(resp.data);
    } catch (outerParseError) {
      // If parsing fails, check if the response contains an error message with embedded JSON
      const errorMatch = resp.data.match(/(\d+)\s+([^:]+):\s+"(.*)"/);
      if (errorMatch) {
        const [, statusCode, statusText, jsonString] = errorMatch;
        try {
          const embeddedJson = JSON.parse(jsonString);
          parsedResponse = {
            status: statusCode,
            statusText: statusText,
            data: embeddedJson
          };
        } catch (innerParseError) {
          parsedResponse = { rawResponse: resp.data };
        }
      } else {
        parsedResponse = { rawResponse: resp.data };
      }
    }

    dispatch(
      setApiResponse({ path: apiPath, response: parsedResponse, environment })
    );
    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: resp.status, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));

    const responseString = resp.data.toLowerCase();
    if (responseString.includes("error:") || responseString.includes("fail") || resp.status >= 400) {
      dispatch(setApiStatus({ path: apiPath, status: "Fail", environment }));
    } else {
      dispatch(setApiStatus({ path: apiPath, status: "Success", environment }));
    }
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log("Error: ", err);
    const errorCode = err.response?.status || "";
    let errorMessage = err.message;

    if (err.response) {

        errorMessage = `${errorCode} ${err.response.statusText}: ${err.response.data}`;
    }

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
    dispatch(
      setApiStatusCode({ path: apiPath, statusCode: errorCode, environment })
    );
    dispatch(setApiResponseTime({ path: apiPath, responseTime, environment }));
  }
};