import React from "react";
import {Box,Typography,Grid,ToggleButtonGroup,ToggleButton,Button,Paper,Chip,useTheme,alpha,TextField} from "@mui/material";
import APIPath from "components/APIPath";
import SuccessFailChart from "components/SuccessFailChart";
import StatusCodeChart from "components/StatusCodeChart";
import ResponseTimeChart from "components/ResponseTimeChart";

export const ChartSection = ({
  chartData,
  statusCodeCounts,
  handleChartDataPointSelection,
}) => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <ChartPaper title="Success vs Fail">
        <SuccessFailChart
          series={chartData.successFail}
          onDataPointSelection={handleChartDataPointSelection("successFail")}
          width="100%"
          height={300}
        />
      </ChartPaper>
    </Grid>
    <Grid item xs={12} md={4}>
      <ChartPaper title="Status Codes">
        <StatusCodeChart
          series={chartData.statusCode}
          statusCodeCounts={statusCodeCounts}
          onDataPointSelection={handleChartDataPointSelection("statusCode")}
          width="100%"
          height={300}
        />
      </ChartPaper>
    </Grid>
    <Grid item xs={12} md={4}>
      <ChartPaper title="Response Times">
        <ResponseTimeChart
          series={chartData.responseTime}
          onDataPointSelection={handleChartDataPointSelection("responseTime")}
          width="100%"
          height={300}
        />
      </ChartPaper>
    </Grid>
  </Grid>
);

export const ChartPaper = ({ title, children }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(45deg, ${alpha(
          theme.palette.background.paper,
          0.8
        )}, ${alpha(theme.palette.background.default, 0.8)})`,
        backdropFilter: "blur(10px)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        color="primary"
        fontWeight="bold"
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export const APIList = ({
  filter,
  setFilter,
  filteredApis,
  searchQuery,
  handleSearchChange,
}) => (
  <Box mt={4}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      {filter && (
        <Chip
          label={`Filtered: ${filter}`}
          onDelete={() => setFilter(null)}
          color="primary"
          sx={{ fontWeight: "bold", borderRadius: 2 }}
        />
      )}
      <TextField
        label="Search API Path"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ width: "300px" }}
      />
    </Box>
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: alpha("#fff", 0.8),
        backdropFilter: "blur(10px)",
      }}
    >
      {filteredApis.length > 0 ? (
        filteredApis.map((api, idx) => <APIPath key={idx} path={api.path} />)
      ) : (
        <Typography variant="body1" align="center">
          No matching API paths found.
        </Typography>
      )}
    </Paper>
  </Box>
);

export const EnvironmentSelector = ({
  selectedEnvironments,
  handleEnvironmentChange,
  handleStartClick,
  theme,
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: 3,
      background: `linear-gradient(45deg, ${alpha(
        theme.palette.primary.light,
        0.1
      )}, ${alpha(theme.palette.secondary.light, 0.1)})`,
    }}
  >
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom color="textSecondary">
          Select Environments:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={selectedEnvironments}
          onChange={handleEnvironmentChange}
          aria-label="environment"
          multiple
          fullWidth
        >
          {["SIT", "DEVQA", "AAT"].map((env) => (
            <ToggleButton
              key={env}
              value={env}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {env}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          onClick={handleStartClick}
          disabled={selectedEnvironments.length === 0}
          sx={{
            height: "40px",
            borderRadius: 3,
            fontWeight: "bold",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            "&:hover": {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            boxShadow: `0 4px 6px ${alpha(theme.palette.primary.main, 0.25)}`,
          }}
        >
          Start API Calls
        </Button>
      </Grid>
    </Grid>
  </Paper>
);
