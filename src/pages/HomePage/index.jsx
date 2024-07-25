import React from "react";
import API from "assets/json/API.json";
import { useDispatch, useSelector } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import { setSelectedEnvironments } from "store/slices/apiSlices";
import APIPath from "components/APIPath";
import { forEach, sortBy } from "lodash";
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
  const { selectedEnvironments, params } = useSelector(state => state.api);

  const handleEnvironmentChange = (_, newEnvironments) => {
    dispatch(setSelectedEnvironments(newEnvironments));
  };

  const onStartClick = () => {
    forEach(API.apis, (api) => {
      selectedEnvironments.forEach(env => {
        dispatch(callAPI(api.path, params[api.path], env));
      });
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>API Tester</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ToggleButtonGroup
              color="primary"
              value={selectedEnvironments}
              onChange={handleEnvironmentChange}
              aria-label="environment"
              multiple
            >
              {['SIT', 'PPM', 'AAT'].map(env => (
                <ToggleButton key={env} value={env}>{env}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button 
              variant="contained" 
              onClick={onStartClick}
              disabled={selectedEnvironments.length === 0}
            >
              Start API Calls
            </Button>
          </Grid>
          <Grid item xs={12}>
            {sortBy(API.apis, ['path']).map((api, idx) => (
              <APIPath key={idx} path={api.path} />
            ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;