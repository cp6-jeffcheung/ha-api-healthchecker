// src/pages/HomePage.jsx
import React, { useState, useMemo } from "react";
import API from "assets/json/API.json";
import { useDispatch, useSelector } from "react-redux";
import { callAPI } from "store/actions/apiAction";
import { setSelectedEnvironments } from "store/slices/apiSlices";
import APIPath from "components/APIPath";
import SuccessFailChart from "components/SuccessFailChart";
import StatusCodeChart from "components/StatusCodeChart";
import ResponseTimeChart from "components/ResponseTimeChart";
import { forEach, sortBy } from "lodash";
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  ToggleButtonGroup, 
  ToggleButton, 
  Button,
  Paper,
  Chip,
  useTheme
} from "@mui/material";
import { getResponseTimeCounts, getStatusCounts, getStatusCodeCounts } from "utils/dataProcessing";

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedEnvironments, params, status, responses, statusCodes, responseTimes} = useSelector(state => state.api);
  const [filter, setFilter] = useState(null);

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

  const responseTimeCounts = getResponseTimeCounts(selectedEnvironments, responseTimes);
  const statusCounts = getStatusCounts(selectedEnvironments, status);
  const statusCodeCounts = getStatusCodeCounts(selectedEnvironments, statusCodes);

  const responseTimeChartSeries = [{
    name: 'Response Time',
    data: [responseTimeCounts['Below 10s'], responseTimeCounts['10s to 30s'], responseTimeCounts['Above 30s']]
  }];

  const successFailChartSeries = [statusCounts.Success, statusCounts.Fail];
  const statusCodeChartSeries = Object.values(statusCodeCounts);

  const handleChartDataPointSelection = (chartType) => (event, chartContext, config) => {
    let newFilter;
    if (chartType === 'successFail') {
      newFilter = config.dataPointIndex === 0 ? 'Success' : 'Fail';
    } else if (chartType === 'statusCode') {
      newFilter = Object.keys(statusCodeCounts)[config.dataPointIndex];
    } else if (chartType === 'responseTime') {
      const categories = ['Below 10s', '10s to 30s', 'Above 30s'];
      newFilter = categories[config.dataPointIndex];
    }
    setFilter(currentFilter => currentFilter === newFilter ? null : newFilter);
  };

  const filteredApis = useMemo(() => {
    if (!filter) return sortBy(API.apis, ['path']);
    return sortBy(API.apis, ['path']).filter(api => 
      selectedEnvironments.some(env => {
        if (filter === 'Success') return status[env][api.path] === 'Success';
        if (filter === 'Fail') return status[env][api.path]?.startsWith('Fail');
        if (filter === 'Below 10s') return (responseTimes[env][api.path] || 0) < 10000;
        if (filter === '10s to 30s') return (responseTimes[env][api.path] || 0) >= 10000 && (responseTimes[env][api.path] || 0) < 30000;
        if (filter === 'Above 30s') return (responseTimes[env][api.path] || 0) >= 30000;
        return statusCodes[env][api.path] === Number(filter);
      })
    );
  }, [filter, selectedEnvironments, status, statusCodes, responseTimes]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
          API Tester Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Select Environments:</Typography>
              <ToggleButtonGroup
                color="primary"
                value={selectedEnvironments}
                onChange={handleEnvironmentChange}
                aria-label="environment"
                multiple
                fullWidth
              >
                {['SIT', 'PPM', 'AAT'].map(env => (
                  <ToggleButton key={env} value={env} sx={{ borderRadius: 2 }}>{env}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="contained" 
                onClick={onStartClick}
                disabled={selectedEnvironments.length === 0}
                fullWidth
                sx={{ 
                  height: '56px',
                  width: '200px', 
                  borderRadius: 2,
                  background: theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  }
                }}
              >
                Start API Calls
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Success vs Fail</Typography>
              <SuccessFailChart 
                series={successFailChartSeries}
                onDataPointSelection={handleChartDataPointSelection('successFail')}
                width="100%"
                height={300}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Status Codes</Typography>
              <StatusCodeChart 
                series={statusCodeChartSeries}
                statusCodeCounts={statusCodeCounts}
                onDataPointSelection={handleChartDataPointSelection('statusCode')}
                width="100%"
                height={300}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Response Times</Typography>
              <ResponseTimeChart 
                series={responseTimeChartSeries} 
                onDataPointSelection={handleChartDataPointSelection('responseTime')}
                width="100%"
                height={300}
              />
            </Paper>
          </Grid>
        </Grid>
        <Box mt={4}>
          {filter && (
            <Chip 
              label={`Filtered: ${filter}`}
              onDelete={() => setFilter(null)}
              color="primary"
              sx={{ mb: 2 }}
            />
          )}
          {filteredApis.map((api, idx) => (
            <APIPath key={idx} path={api.path} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;