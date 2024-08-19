// src/components/ResponseTimeChart.jsx
import React from "react";
import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { responseTimeChartOptions } from "../utils/chartConfigs";

const ResponseTimeChart = ({ series }) => (
  <Box height="300px" mb={2}>
    <Chart
      options={responseTimeChartOptions}
      series={series}
      type="bar"
      width="100%"
      height="100%"
    />
  </Box>
);

export default ResponseTimeChart;