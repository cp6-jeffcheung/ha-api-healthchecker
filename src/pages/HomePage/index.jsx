import React, { useState } from "react";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import API from "assets/json/API.json";
import host from "assets/json/host.json";
import Grid from "@mui/material/Grid";
import "./index.scss";
import { useDispatch } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import { useSelector } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();
  const [apiEnv, setApiEnv] = useState([]);

  const responses = useSelector((state) => state.api.responses);
  console.log("responses", responses);

  const handleApiEnvChange = (event, value) => {
    setApiEnv(value);
  };

  const onStartClick = (event) => {
    console.log("Start Calling " + host.hostPreEnv + "sit" + host.hostPostEnv);

    //

    dispatch(
      callAPI(
        host.hostPreEnv +
          "sit" +
          host.hostPostEnv +
          "app-config/view-mode?hospCode=VH&workstationId=VH_HAHO&userId=@CMSIT&wrkStnType=0"
      )
    );
  };

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
        {/* show the list of api path with responses and status */}
        {JSON.stringify(responses)}
      </Grid>
    </Grid>
  );
};

export default HomePage;
