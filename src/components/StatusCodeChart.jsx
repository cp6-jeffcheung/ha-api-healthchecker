// src/components/StatusCodeChart.jsx
import React from "react";
import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { getStatusCodeChartOptions } from "../utils/chartConfigs";

const StatusCodeChart = ({
  series,
  statusCodeCounts,
  onDataPointSelection,
  onChartClick,
}) => (
  <Box height="300px" mb={2}>
    <Chart
      options={getStatusCodeChartOptions(
        statusCodeCounts,
        onDataPointSelection,
        onChartClick
      )}
      series={series}
      type="pie"
      width="100%"
      height="100%"
    />
  </Box>
);

export default StatusCodeChart;
