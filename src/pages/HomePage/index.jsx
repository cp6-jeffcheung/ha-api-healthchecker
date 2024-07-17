import React, { useState } from "react";
import API from "assets/json/API.json";
import "./index.scss";
import { useDispatch } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import APIPath from "components/APIPath";
import forEach from "lodash/forEach";
import groupBy from "lodash/groupBy";
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  ToggleButtonGroup, 
  ToggleButton, 
  Button, 
  Accordion,  
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HomePage = () => {
  const dispatch = useDispatch();
  const [apiEnv, setApiEnv] = useState([]);
  const [expandedModes, setExpandedModes] = useState(['view-mode', 'maintenance-mode']);

  const handleApiEnvChange = (event, value) => {
    setApiEnv(value);
  };

  const onStartClick = (event) => {
    forEach(API.apis, (api) => {
      dispatch(callAPI(api.path, api.params));
    });
  };

  const groupedApis = groupBy(API.apis, (api) => {
    return api.path.includes('view-mode') ? 'view-mode' : 'maintenance-mode';
  });

  const handleModeExpand = (mode) => (event, isExpanded) => {
    setExpandedModes(isExpanded 
      ? [...expandedModes, mode]
      : expandedModes.filter(m => m !== mode)
    );
  };

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
            {Object.entries(groupedApis).map(([mode, apis]) => (
              <Accordion 
                key={mode}
                expanded={expandedModes.includes(mode)}
                onChange={handleModeExpand(mode)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{mode}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {apis.map((api, idx) => (
                    <APIPath key={idx} path={api.path} params={api.params} />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
