import React from "react";

// path: '/api-path'
// status: 'not-tested', 'passed', 'failed'
const APIPath = ({ path, status }) => {
  return (
    <Grid container>
      <Grid container item xs={8}>
        {path}
      </Grid>
      <Grid container item xs={4}></Grid>
    </Grid>
  );
};

export default APIPath;
