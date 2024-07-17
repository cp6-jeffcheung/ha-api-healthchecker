import React, { useState } from "react";
import API from "assets/json/API.json";
import "./index.scss";
import { useDispatch } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import APIPath from "components/APIPath";
import forEach from "lodash/forEach";
import sortBy from "lodash/sortBy";
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  ToggleButtonGroup, 
  ToggleButton, 
  Button
} from "@mui/material";

const HomePage = () => {
  const dispatch = useDispatch();
  const [apiEnv, setApiEnv] = useState([]);

  const handleApiEnvChange = (event, value) => {
    setApiEnv(value);
  };

  const onStartClick = (event) => {
    forEach(API.apis, (api) => {
      dispatch(callAPI(api.path, api.params));
    });
  };

  const sortedApis = sortBy(API.apis, ['path']);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Tester
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ToggleButtonGroup
              color="primary"
              value={apiEnv}
              onChange={handleApiEnvChange}
              aria-label="environment"
            >
              <ToggleButton value="sit">SIT</ToggleButton>
              <ToggleButton value="ppm">PPM</ToggleButton>
              <ToggleButton value="aat">AAT</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" onClick={onStartClick}>
              Start API Calls
            </Button>
          </Grid>
          <Grid item xs={12}>
          {sortedApis.map((api, idx) => (
            <APIPath 
              key={idx} 
              path={api.path} 
              params={api.params} 
              status={api.status || 'not-tested'}
            />
          ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
