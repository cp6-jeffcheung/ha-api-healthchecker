import axios from "axios";
import { setResponses } from "store/slices/apiSlices";

export const callAPI = (apiPath) => {
  return async (dispatch, getState) => {
    try {
      const resp = await axios.get(apiPath);
      dispatch(setResponses(resp?.data));
    } catch (err) {
      console.log("Error: ", err);
    }
  };
};
