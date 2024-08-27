import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Tooltip,
} from "@mui/material";
import ReactJson from "react-json-view";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CompareIcon from "@mui/icons-material/Compare";
import { updateApiParams } from "store/slices/apiSlices";
import ComparisonGrid from "./ComparisonGrid";
import { getStatusColor, isValidResponse, truncateValue } from "utils/apiUtils";

const APIPath = ({ path, params }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { responses, statusCodes, responseTimes, selectedEnvironments } =
    useSelector((state) => state.api);
  const [selectedEnvironment, setSelectedEnvironment] = useState(
    selectedEnvironments[0] || ""
  );
  const [comparisonEnvironments, setComparisonEnvironments] = useState([]);
  const [basisEnvironment, setBasisEnvironment] = useState("");

  const formatResponse = (response) => {
    if (typeof response === "string") {
      try {
        return JSON.parse(response);
      } catch (e) {
        return { message: response };
      }
    }
    return response || { message: "No response yet" };
  };

  const response = formatResponse(responses[selectedEnvironment]?.[path]);
  const environmentStatuses = {
    SIT: statusCodes.SIT[path] || "Not Tested",
    DEVQA: statusCodes.DEVQA[path] || "Not Tested",
    AAT: statusCodes.AAT[path] || "Not Tested",
  };

  const handleParamChange = useCallback(
    (environment) => (edit) => {
      const currentParams = params[environment] || {};
      dispatch(
        updateApiParams({
          path,
          params: { ...currentParams, [edit.name]: edit.new_value },
          environment,
        })
      );
    },
    [dispatch, path, params]
  );

  const getUniqueKeys = (basisEnv, comparisonEnv) => {
    const basisResponse = isValidResponse(responses[basisEnv]?.[path])
      ? responses[basisEnv][path]
      : {};
    const comparisonResponse = isValidResponse(responses[comparisonEnv]?.[path])
      ? responses[comparisonEnv][path]
      : {};

    if (typeof comparisonResponse !== "object" || comparisonResponse === null) {
      return ["message"];
    }

    return Object.keys(comparisonResponse).filter(
      (key) => !basisResponse.hasOwnProperty(key)
    );
  };

  const getMissingKeys = (basisEnv, comparisonEnv) => {
    const basisResponse = isValidResponse(responses[basisEnv]?.[path])
      ? responses[basisEnv][path]
      : {};
    const comparisonResponse = isValidResponse(responses[comparisonEnv]?.[path])
      ? responses[comparisonEnv][path]
      : {};
    return Object.keys(basisResponse).filter(
      (key) => !comparisonResponse.hasOwnProperty(key)
    );
  };

  const getDifferentValues = (basisEnv, comparisonEnvs) => {
    const basisResponse = isValidResponse(responses[basisEnv]?.[path])
      ? responses[basisEnv][path]
      : {};
    return Object.keys(basisResponse).reduce((acc, key) => {
      const basisValue = JSON.stringify(basisResponse[key]);
      const row = { id: key, key, [basisEnv]: basisValue };
      let isDifferent = false;

      comparisonEnvs.forEach((env) => {
        if (env !== basisEnv) {
          const comparisonResponse = isValidResponse(responses[env]?.[path])
            ? responses[env][path]
            : {};
          const comparisonValue = JSON.stringify(comparisonResponse[key]);
          row[env] = comparisonValue;
          if (basisValue !== comparisonValue) isDifferent = true;
        }
      });

      if (isDifferent) acc.push(row);
      return acc;
    }, []);
  };

  const comparisonData = useMemo(() => {
    if (!basisEnvironment || comparisonEnvironments.length < 2) return [];
    return comparisonEnvironments.flatMap((env) =>
      env !== basisEnvironment
        ? getUniqueKeys(basisEnvironment, env).map((key) => ({
            id: `${env}-${key}`,
            [env]: key,
          }))
        : []
    );
  }, [basisEnvironment, comparisonEnvironments, responses, path]);

  const missingKeysData = useMemo(() => {
    if (!basisEnvironment || comparisonEnvironments.length < 2) return [];
    return comparisonEnvironments.flatMap((env) =>
      env !== basisEnvironment
        ? getMissingKeys(basisEnvironment, env).map((key) => ({
            id: `${env}-${key}`,
            [env]: key,
          }))
        : []
    );
  }, [basisEnvironment, comparisonEnvironments, responses, path]);

  const differentValuesData = useMemo(() => {
    if (!basisEnvironment || comparisonEnvironments.length < 2) return [];
    return getDifferentValues(basisEnvironment, comparisonEnvironments);
  }, [basisEnvironment, comparisonEnvironments, responses, path]);

  const columns = useMemo(
    () =>
      comparisonEnvironments
        .filter((env) => env !== basisEnvironment)
        .map((env) => ({ field: env, headerName: env, flex: 1 })),
    [comparisonEnvironments, basisEnvironment]
  );

  const differentValuesColumns = useMemo(
    () => [
      { field: "key", headerName: "Key", flex: 1 },
      {
        field: basisEnvironment,
        headerName: basisEnvironment,
        flex: 2,
        renderCell: (params) => (
          <Tooltip title={params.value} placement="top">
            <span>{truncateValue(params.value)}</span>
          </Tooltip>
        ),
      },
      ...comparisonEnvironments
        .filter((env) => env !== basisEnvironment)
        .map((env) => ({
          field: env,
          headerName: env,
          flex: 2,
          renderCell: (params) => (
            <Tooltip title={params.value} placement="top">
              <span>{truncateValue(params.value)}</span>
            </Tooltip>
          ),
        })),
    ],
    [basisEnvironment, comparisonEnvironments]
  );

  const exportToJson = (data, fileName) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${fileName}.json`;
    link.click();
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: "hidden", borderRadius: 2 }}>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        disableGutters
      >
        <AccordionSummary sx={{ backgroundColor: theme.palette.grey[100] }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight="medium">
                {path}
              </Typography>
            </Grid>
            {["SIT", "DEVQA", "AAT"].map((env) => (
              <Grid item xs={4} sm={2} key={env}>
                <Chip
                  label={`${env}: ${environmentStatuses[env] || "Not Tested"}`}
                  color={getStatusColor(environmentStatuses[env])}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
                {typeof environmentStatuses[env] === "number" &&
                  environmentStatuses[env] >= 200 &&
                  environmentStatuses[env] < 300 && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      {responseTimes[env]?.[path] || "N/A"} ms
                    </Typography>
                  )}
              </Grid>
            ))}
          </Grid>
        </AccordionSummary>
        {expanded && (
          <AccordionDetails sx={{ p: 3 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
            >
              <Typography variant="h6" gutterBottom>
                Params:
              </Typography>
              <Tabs
                value={selectedEnvironment}
                onChange={(_, newEnvironment) =>
                  setSelectedEnvironment(newEnvironment)
                }
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                {selectedEnvironments.map((env) => (
                  <Tab key={env} label={env} value={env} />
                ))}
              </Tabs>
              <Box width="100%" mb={3}>
                <ReactJson
                  src={params[selectedEnvironment] || {}}
                  onEdit={handleParamChange(selectedEnvironment)}
                  onDelete={(remove) => {
                    const updatedParams =
                      { ...params[path]?.[selectedEnvironment] } || {};
                    delete updatedParams[remove.name];
                    dispatch(
                      updateApiParams({
                        path,
                        params: updatedParams,
                        environment: selectedEnvironment,
                      })
                    );
                  }}
                  onAdd={(add) =>
                    handleParamChange(selectedEnvironment)({
                      name: add.name,
                      new_value: add.new_value,
                    })
                  }
                  displayDataTypes={false}
                  name={null}
                  style={{
                    textAlign: "left",
                    backgroundColor: theme.palette.grey[100],
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Response:
              </Typography>
              {selectedEnvironments.length > 0 && (
                <Box width="100%">
                  <Tabs
                    value={selectedEnvironment}
                    onChange={(_, newEnvironment) =>
                      setSelectedEnvironment(newEnvironment)
                    }
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                  >
                    {selectedEnvironments.map((env) => (
                      <Tab key={env} label={env} value={env} />
                    ))}
                  </Tabs>
                  <Box mt={2} width="100%">
                    {typeof response === "object" ? (
                      <ReactJson
                        src={response}
                        displayDataTypes={false}
                        name={null}
                        collapsed={1}
                        theme="monokai"
                        style={{ textAlign: "left", borderRadius: "4px" }}
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        component="pre"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          bgcolor: "grey.100",
                          p: 2,
                          borderRadius: "4px",
                        }}
                      >
                        {response}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Response Comparison:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Compare Environments</InputLabel>
                    <Select
                      multiple
                      value={comparisonEnvironments}
                      onChange={(event) => {
                        setComparisonEnvironments(event.target.value);
                        if (
                          event.target.value.length > 0 &&
                          !basisEnvironment
                        ) {
                          setBasisEnvironment(event.target.value[0]);
                        }
                      }}
                      label="Compare Environments"
                    >
                      {["SIT", "DEVQA", "AAT"].map((env) => (
                        <MenuItem key={env} value={env}>
                          {env}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Basis Environment</InputLabel>
                    <Select
                      value={basisEnvironment}
                      onChange={(event) =>
                        setBasisEnvironment(event.target.value)
                      }
                      label="Basis Environment"
                      disabled={comparisonEnvironments.length < 2}
                    >
                      {comparisonEnvironments.map((env) => (
                        <MenuItem key={env} value={env}>
                          {env}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {comparisonEnvironments.length >= 2 && basisEnvironment && (
                <>
                  <ComparisonGrid
                    title="Keys present in comparison environments but not in basis"
                    icon={
                      <AddIcon
                        fontSize="small"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                    }
                    data={comparisonData}
                    columns={columns}
                    onExport={() => exportToJson(comparisonData, "unique_keys")}
                  />
                  <ComparisonGrid
                    title="Keys missing in comparison environments"
                    icon={
                      <RemoveIcon
                        fontSize="small"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                    }
                    data={missingKeysData}
                    columns={columns}
                    onExport={() =>
                      exportToJson(missingKeysData, "missing_keys")
                    }
                  />
                  <ComparisonGrid
                    title="Keys with different values across environments"
                    icon={
                      <CompareIcon
                        fontSize="small"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                    }
                    data={differentValuesData}
                    columns={differentValuesColumns}
                    onExport={() =>
                      exportToJson(differentValuesData, "different_values")
                    }
                  />
                </>
              )}
            </Box>
          </AccordionDetails>
        )}
      </Accordion>
    </Paper>
  );
};

export default APIPath;
