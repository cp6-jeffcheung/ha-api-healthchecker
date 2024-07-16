import React from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import get from "lodash/get";

// path: '/api-path'
// status: 'not-tested', 'passed', 'failed'
const APIPath = ({ path, params, status }) => {
  const responses = useSelector((state) => state.api.responses);

  // console.log('get(responses, path, "") ', responses);

  return (
    <Grid container>
      <Grid container item xs={8}>
        {path}
      </Grid>
      <Grid container item xs={4}></Grid>
      <Grid container item xs={12}>
        {JSON.stringify(get(responses, path, ""))}
      </Grid>
    </Grid>
  );
};

export default APIPath;
