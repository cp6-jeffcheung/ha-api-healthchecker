import React, { useRef, useState } from "react";
import { Container, Box, Typography, Paper, TextField, Button, Grid, Checkbox, FormControlLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import JSONViewer from './JSONViewer';
import data from 'assets/json/API.json';

const EditApiPage = ({ apiJson, setApiJson, setApiConfig, setSnackbar }) => {
  const fileInputRef = useRef(null);
  const [apiPaths, setApiPaths] = useState([
    {
      method: "post",
      path: "",
      params: [{ key: "", value: "", environments: [] }]
    }
  ]);

  const handleKeyValuePairChange = (apiIndex, paramIndex, field, value) => {
    const updatedApiPaths = [...apiPaths];
    updatedApiPaths[apiIndex].params[paramIndex][field] = value;
    setApiPaths(updatedApiPaths);
  };

  const handleAddKeyValuePair = (apiIndex) => {
    const updatedApiPaths = [...apiPaths];
    updatedApiPaths[apiIndex].params.push({ key: "", value: "", environments: [] });
    setApiPaths(updatedApiPaths);
  };

  const handleAddApiPath = () => {
    setApiPaths([...apiPaths, {
      method: "post",
      path: "",
      params: [{ key: "", value: "", environments: [] }]
    }]);
  };

  const handleEnvironmentToggle = (apiIndex, paramIndex, env) => {
    const updatedApiPaths = [...apiPaths];
    const environments = updatedApiPaths[apiIndex].params[paramIndex].environments;
    const index = environments.indexOf(env);
    if (index > -1) {
      environments.splice(index, 1);
    } else {
      environments.push(env);
    }
    setApiPaths(updatedApiPaths);
  };

  const handleApiJsonSave = () => {
    try {
      const parsedConfig = { apis: formatApiPathsForExport(apiPaths) };
      setApiConfig(parsedConfig);
      setSnackbar({
        open: true,
        message: "API configuration updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Invalid API configuration format. Please check your input.",
        severity: "error",
      });
    }
  };

  const formatApiPathsForExport = (apiPaths) => {
    return apiPaths.map(api => {
      const formattedApi = {
        method: api.method,
        path: api.path,
        sit: { params: {} },
        devqa: { params: {} },
        aat: { params: {} }
      };

      api.params.forEach(param => {
        param.environments.forEach(env => {
          formattedApi[env.toLowerCase()].params[param.key] = param.value;
        });
      });

      return formattedApi;
    });
  };

  const handleExportJson = () => {
    const formData = { apis: formatApiPathsForExport(apiPaths) };
    const jsonData = JSON.stringify(formData, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FormData.json";
    link.click();
    URL.revokeObjectURL(url);
    setSnackbar({
      open: true,
      message: "Form data exported successfully",
      severity: "success",
    });
  };

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          setApiJson(content);
          const parsedConfig = JSON.parse(content);
          if (parsedConfig.apis) {
            const formattedApiPaths = parsedConfig.apis.map(api => ({
              method: api.method,
              path: api.path,
              params: Object.keys(api.sit.params).map(key => ({
                key,
                value: api.sit.params[key],
                environments: ['SIT', 'DEVQA', 'AAT'].filter(env => 
                  api[env.toLowerCase()].params[key] === api.sit.params[key]
                )
              }))
            }));
            setApiPaths(formattedApiPaths);
            setApiConfig(parsedConfig);
            setSnackbar({
              open: true,
              message: "API configuration imported successfully",
              severity: "success",
            });
          } else {
            throw new Error("Invalid JSON structure");
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Invalid JSON file. Please check the file content.",
            severity: "error",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Edit API Configuration
                </Typography>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <div></div>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleApiJsonSave}
                                startIcon={<SaveIcon />}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleExportJson}
                                startIcon={<DownloadIcon />}
                            >
                                Export JSON
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={triggerFileInput}
                                startIcon={<UploadIcon />}
                            >
                                Import JSON
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImportJson}
                                accept=".json"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <h1>JSON Viewer</h1>
            <JSONViewer jsonData={data} />

            <div>
        <h2>API Input Form</h2>
        <button onClick={handleAddApiPath}>Add Api Path +</button>
        <div>
          {apiPaths.map((item, apiIndex) => (
            <div key={apiIndex}>
              <label>
                API Path:
                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => {
                    const updatedApiPaths = [...apiPaths];
                    updatedApiPaths[apiIndex].path = e.target.value;
                    setApiPaths(updatedApiPaths);
                  }}
                />
              </label>
              <br />

              <label>
                Select an Option:
                <select
                  value={item.method}
                  onChange={(e) => {
                    const updatedApiPaths = [...apiPaths];
                    updatedApiPaths[apiIndex].method = e.target.value;
                    setApiPaths(updatedApiPaths);
                  }}
                >
                  <option value="get">get</option>
                  <option value="post">post</option>
                  <option value="put">put</option>
                  <option value="delete">delete</option>
                </select>
              </label>
              <br />

              <h3>Parameters:</h3>
              {item.params.map((param, paramIndex) => (
                <div key={paramIndex}>
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleKeyValuePairChange(apiIndex, paramIndex, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleKeyValuePairChange(apiIndex, paramIndex, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.environments.includes('SIT')}
                        onChange={() => handleEnvironmentToggle(apiIndex, paramIndex, 'SIT')}
                      />
                    }
                    label="SIT"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.environments.includes('DEVQA')}
                        onChange={() => handleEnvironmentToggle(apiIndex, paramIndex, 'DEVQA')}
                      />
                    }
                    label="DEVQA"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.environments.includes('AAT')}
                        onChange={() => handleEnvironmentToggle(apiIndex, paramIndex, 'AAT')}
                      />
                    }
                    label="AAT"
                  />
                </div>
              ))}
              <button onClick={() => handleAddKeyValuePair(apiIndex)}>Add Parameter +</button>

              <br />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default EditApiPage;