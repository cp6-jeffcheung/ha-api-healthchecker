import axios from "axios";
import { setResponses } from "store/slices/apiSlices";
import host from "assets/json/host.json";

export const callAPI = (apiPath, params) => {
  return async (dispatch, getState) => {
    const apiState = getState().api;
    try {
      let apiFullUrl = host.hostPreEnv + "sit" + host.hostPostEnv + apiPath;

      let paramKeys = Object.keys(params);
      paramKeys.forEach((key, idx) => {
        apiFullUrl += (idx === 0 ? "?" : "&") + key + "=" + params[key];
      });
      const resp = await axios.get(apiFullUrl);
      let newResponses = {
        ...apiState.responses,
        [apiPath]: resp?.data,
      };
      dispatch(setResponses(newResponses));
    } catch (err) {
      console.log("Error: ", err);
    }
  };
};
