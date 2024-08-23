import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Paper,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Collapse,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import APIPath from "components/APIPath";
import SuccessFailChart from "components/SuccessFailChart";
import StatusCodeChart from "components/StatusCodeChart";
import ResponseTimeChart from "components/ResponseTimeChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { resetApiData } from "store/slices/apiSlices";

export const ChartSection = ({
  chartData,
  statusCodeCounts,
  handleChartDataPointSelection,
  hasStarted,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (hasStarted) {
      setExpanded(true);
    }
  }, [hasStarted]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
        mb: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" color="primary" fontWeight="bold">
          API Analytics
        </Typography>
        {hasStarted && (
          <IconButton onClick={handleExpandClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>
      <Collapse in={expanded}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ChartBox title="Success vs Fail">
              <SuccessFailChart
                series={chartData.successFail}
                onDataPointSelection={handleChartDataPointSelection(
                  "successFail"
                )}
                width="100%"
                height={300}
              />
            </ChartBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartBox title="Status Codes">
              <StatusCodeChart
                series={chartData.statusCode}
                statusCodeCounts={statusCodeCounts}
                onDataPointSelection={handleChartDataPointSelection(
                  "statusCode"
                )}
                width="100%"
                height={300}
              />
            </ChartBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartBox title="Response Times">
              <ResponseTimeChart
                series={chartData.responseTime}
                onDataPointSelection={handleChartDataPointSelection(
                  "responseTime"
                )}
                width="100%"
                height={300}
              />
            </ChartBox>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

const ChartBox = ({ title, children }) => (
  <Box>
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
  </Box>
);

export const APIList = ({ filteredApis }) => (
  <Box mt={4}>
    <Box display="flex" justifyContent="center">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: alpha("#fff", 0.8),
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {filteredApis.length > 0 ? (
          filteredApis.map((api, idx) => (
            <Box key={idx} display="flex" alignItems="center" mb={2}>
              <Chip
                label={api.method.toUpperCase()}
                color={
                  api.method.toLowerCase() === "get" ? "primary" : "secondary"
                }
                size="small"
                sx={{ mr: 2, minWidth: "60px" }}
              />
              <Box flexGrow={1}>
                <APIPath path={api.path} params={api.params} />
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No matching API paths found.
          </Typography>
        )}
      </Paper>
    </Box>
  </Box>
);

export const EnvironmentSelector = ({
  selectedEnvironments,
  handleEnvironmentChange,
  handleStartClick,
  theme,
}) => {
  const dispatch = useDispatch();

  const handleResetClick = () => {
    handleEnvironmentChange(null, []);
    dispatch(resetApiData());
  };

  return (
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
          <Box display="flex" gap={2}>
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
                boxShadow: `0 4px 6px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
                flex: 1,
              }}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetClick}
              sx={{
                height: "40px",
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                flex: 1,
              }}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const FilterSection = ({
  methodFilter,
  handleMethodFilterChange,
  searchQuery,
  handleSearchChange,
}) => (
  <Box sx={{ display: "flex", mb: 2, gap: 2, justifyContent: "center" }}>
    <FormControl variant="outlined" size="small" sx={{ width: "150px" }}>
      <InputLabel>Method</InputLabel>
      <Select
        value={methodFilter}
        onChange={handleMethodFilterChange}
        label="Method"
      >
        <MenuItem value="ALL">All</MenuItem>
        <MenuItem value="GET">GET</MenuItem>
        <MenuItem value="POST">POST</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Search APIs"
      variant="outlined"
      value={searchQuery}
      onChange={handleSearchChange}
      size="small"
      sx={{ width: "300px" }}
    />
  </Box>
);
