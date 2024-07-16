import React, { useState } from "react";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import API from "assets/json/API.json";
import Grid from "@mui/material/Grid";
import "./index.scss";
import { useDispatch } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import { useSelector } from "react-redux";
import APIPath from "components/APIPath";
import forEach from "lodash/forEach";
import map from "lodash/map";

const HomePage = () => {
  const dispatch = useDispatch();
  const [apiEnv, setApiEnv] = useState([]);

  const handleApiEnvChange = (event, value) => {
    setApiEnv(value);
  };

  const onStartClick = (event) => {
    forEach(API.apis, (api, idx) => {
      dispatch(callAPI(api.path, api.params));
    });
  };

  console.log("API", API);

  return (
    <Grid container className="Grid-HomePage-wrapper">
      <Grid container item xs={12}>
        {/* toggle buttons for choosing which environments to test */}
        <Grid container item xs={6}>
          <ToggleButtonGroup
            color="primary"
            value={apiEnv}
            exclusive={false}
            onChange={handleApiEnvChange}
            aria-label="env"
          >
            <ToggleButton value="sit">SIT</ToggleButton>
            <ToggleButton value="ppm">PPM</ToggleButton>
            <ToggleButton value="aat">AAT</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid container item xs={6}>
          <Button onClick={onStartClick}>Start</Button>
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        {map(API.apis, (api, idx) => {
          return <APIPath path={api.path} params={api.params} />;
        })}
        {/* show the list of api path with responses and status */}
      </Grid>
    </Grid>
  );
};

export default HomePage;
