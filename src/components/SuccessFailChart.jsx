// src/components/SuccessFailChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography } from "@mui/material";
import { getSuccessFailChartOptions } from '../utils/chartConfigs';

const SuccessFailChart = ({ series, onDataPointSelection, onChartClick }) => (
  <Box height="300px" mb={2}>
    <Typography variant="h6" align="center">Success/Fail Distribution</Typography>
    <Chart
      options={getSuccessFailChartOptions(onDataPointSelection, onChartClick)}
      series={series}
      type="pie"
      width="100%"
      height="100%"
    />
  </Box>
);

export default SuccessFailChart;