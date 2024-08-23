import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forEach, sortBy } from "lodash";
import {
  Container,
  Box,
  Typography,
  useTheme,
  styled,
  Snackbar,
  Alert,
} from "@mui/material";
import { callAPI } from "store/actions/apiAction";
import { setSelectedEnvironments } from "store/slices/apiSlices";
import {
  getResponseTimeCounts,
  getStatusCounts,
  getStatusCodeCounts,
} from "utils/dataProcessing";
import { ChartSection, APIList, EnvironmentSelector } from "./utils";
import { Drawer, DrawerHeader, drawerWidth } from "components/Layout/Drawer";
import { AppBar } from "components/Layout/Appbar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import EditApiPage from "pages/EditApiPage/index";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [apiConfig, setApiConfig] = useState(() => {
    const API = require("assets/json/API.json");
    return API;
  });
  const [apiJson, setApiJson] = useState(JSON.stringify(apiConfig, null, 2));

  useEffect(() => {
    try {
      const parsedConfig = JSON.parse(apiJson);
      setApiConfig(parsedConfig);
    } catch (error) {
      console.error("Invalid JSON format:", error);
      setSnackbar({
        open: true,
        message: "Invalid JSON format",
        severity: "error",
      });
    }
  }, [apiJson]);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedEnvironments, params, status, statusCodes, responseTimes } =
    useSelector((state) => state.api);
  const [filter, setFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasStarted, setHasStarted] = useState(false);

  const responseTimeCounts = getResponseTimeCounts(
    selectedEnvironments,
    responseTimes
  );
  const statusCounts = getStatusCounts(selectedEnvironments, status);
  const statusCodeCounts = getStatusCodeCounts(
    selectedEnvironments,
    statusCodes
  );

  const chartData = {
    responseTime: [
      {
        name: "Response Time",
        data: [
          responseTimeCounts["Below 10s"],
          responseTimeCounts["10s to 30s"],
          responseTimeCounts["Above 30s"],
        ],
      },
    ],
    successFail: [statusCounts.Success, statusCounts.Fail],
    statusCode: Object.values(statusCodeCounts),
  };

  const filteredApis = useMemo(() => {
    let apis = sortBy(apiConfig.apis, ["path"]);

    if (searchQuery) {
      apis = apis.filter((api) =>
        api.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (!filter) return apis;
    return apis.filter((api) =>
      selectedEnvironments.some((env) => {
        if (filter === "Success") return status[env][api.path] === "Success";
        if (filter === "Fail") return status[env][api.path]?.startsWith("Fail");
        if (filter === "Below 10s")
          return (responseTimes[env][api.path] || 0) < 10000;
        if (filter === "10s to 30s")
          return (
            (responseTimes[env][api.path] || 0) >= 10000 &&
            (responseTimes[env][api.path] || 0) < 30000
          );
        if (filter === "Above 30s")
          return (responseTimes[env][api.path] || 0) >= 30000;
        return statusCodes[env][api.path] === Number(filter);
      })
    );
  }, [
    filter,
    selectedEnvironments,
    status,
    statusCodes,
    responseTimes,
    searchQuery,
    apiConfig,
  ]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEnvironmentChange = (_, newEnvironments) => {
    dispatch(setSelectedEnvironments(newEnvironments));
  };

  const handleStartClick = () => {
    setHasStarted(true);
    forEach(apiConfig.apis, (api) => {
      selectedEnvironments.forEach((env) => {
        try {
          const apiParams = api.params[env] || {};
          const method = api.method.toUpperCase();
          
          if (method === 'GET') {
            dispatch(callAPI(api.path, apiParams, env, 'GET'));
          } else if (method === 'POST') {
            dispatch(callAPI(api.path, {}, env, 'POST', apiParams));
          } else {
            console.warn(`Unsupported method: ${method} for API: ${api.path}`);
          }
        } catch (error) {
          console.error(
            `Error calling API for path: ${api.path}, env: ${env}`,
            error
          );
          setSnackbar({
            open: true,
            message: `Error calling API: ${api.path}`,
            severity: "error",
          });
        }
      });
    });
  };

  const handleChartDataPointSelection = (chartType) => (_, __, config) => {
    const filterMap = {
      successFail: ["Success", "Fail"],
      statusCode: Object.keys(statusCodeCounts),
      responseTime: ["Below 10s", "10s to 30s", "Above 30s"],
    };
    const newFilter = filterMap[chartType][config.dataPointIndex];
    setFilter((currentFilter) =>
      currentFilter === newFilter ? null : newFilter
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <EnvironmentSelector
                selectedEnvironments={selectedEnvironments}
                handleEnvironmentChange={handleEnvironmentChange}
                handleStartClick={handleStartClick}
                theme={theme}
              />
            </Box>
            <ChartSection
              chartData={chartData}
              statusCodeCounts={statusCodeCounts}
              handleChartDataPointSelection={handleChartDataPointSelection}
              hasStarted={hasStarted}
            />
            <APIList
              filter={filter}
              setFilter={setFilter}
              filteredApis={filteredApis}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              apiConfig={apiConfig}
            />
          </>
        );
      case "edit":
        return (
          <EditApiPage
            apiJson={apiJson}
            setApiJson={setApiJson}
            apiConfig={apiConfig}
            setApiConfig={setApiConfig}
            setSnackbar={setSnackbar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            API Tester by Jerry & Sun
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        setCurrentPage={setCurrentPage}
      />
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            {currentPage === "home" && (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                  <EnvironmentSelector
                    selectedEnvironments={selectedEnvironments}
                    handleEnvironmentChange={handleEnvironmentChange}
                    handleStartClick={handleStartClick}
                    theme={theme}
                  />
                </Box>
                <ChartSection
                  chartData={chartData}
                  statusCodeCounts={statusCodeCounts}
                  handleChartDataPointSelection={handleChartDataPointSelection}
                  hasStarted={hasStarted}
                />
                <APIList
                  filter={filter}
                  setFilter={setFilter}
                  filteredApis={filteredApis}
                  searchQuery={searchQuery}
                  handleSearchChange={handleSearchChange}
                  apiConfig={apiConfig}
                />
              </>
            )}
            {currentPage === "edit" && (
              <EditApiPage
                apiJson={apiJson}
                setApiJson={setApiJson}
                apiConfig={apiConfig}
                setApiConfig={setApiConfig}
                setSnackbar={setSnackbar}
              />
            )}
          </Box>
        </Container>
      </Main>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;