import React, { useRef, useState } from "react";
import { Container, Box, Typography, Paper, TextField, Button, Grid } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import JSONViewer from './JSONViewer';
import data from 'assets/json/API.json';

const EditApiPage = ({ apiJson, setApiJson, setApiConfig, setSnackbar }) => {
    const fileInputRef = useRef(null);
    const [apiPath, setApiPath] = useState('');
    const [selectedOption, setSelectedOption] = useState('get');
    const [selectedEnvironment, setSelectedEnvironment] = useState('SIT');
    const [apiPaths, setApiPaths] = useState([{ path: '', selectedOption: 'get', selectedEnvironment: 'SIT', params: [] }]);
  
    const handleAddApiPath = () => {
      setApiPaths([...apiPaths, { apiPath: '', selectedOption: 'get', selectedEnvironment: 'SIT', paramValue: [] }]);
    };
  
    const handleAddApiParams = (index) => {
      const updatedApiPaths = [...apiPaths];
      updatedApiPaths[index].paramValue = [...updatedApiPaths[index].paramValue, ''];
      setApiPaths(updatedApiPaths);
    };


    const handleApiJsonSave = () => {
      try {
          const parsedConfig = apiPaths; // Save the API input form data as the configuration
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

  const handleExportJson = () => {
    const formData = apiPaths.map(item => ({ apiPath: item.path, selectedOption: item.selectedOption, selectedEnvironment: item.selectedEnvironment, params: item.paramValue }));
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
          setApiConfig(parsedConfig);
          setSnackbar({
            open: true,
            message: "API configuration imported successfully",
            severity: "success",
          });
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
          <div>

          </div>
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
      {apiPaths.map((item, index) => (
        <div key={index}>
          <label>
            API Path:
            <input
              type="text"
              value={item.path}
              onChange={(e) => {
                const updatedApiPaths = [...apiPaths];
                updatedApiPaths[index].apiPath = e.target.value;
                setApiPaths(updatedApiPaths);
              }}
            />
          </label>
          <br />

          <label>
            Select an Option:
            <select
              value={item.selectedOption}
              onChange={(e) => {
                const updatedApiPaths = [...apiPaths];
                updatedApiPaths[index].selectedOption = e.target.value;
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

          <div>
            Select Environment:
            <label>
              <input
                type="radio"
                value="SIT"
                checked={item.selectedEnvironment === 'SIT'}
                onChange={() => {
                  const updatedApiPaths = [...apiPaths];
                  updatedApiPaths[index].selectedEnvironment = 'SIT';
                  setApiPaths(updatedApiPaths);
                }}
              />
              SIT
            </label>
            <label>
              <input
                type="radio"
                value="DEVQA"
                checked={item.selectedEnvironment === 'DEVQA'}
                onChange={() => {
                  const updatedApiPaths = [...apiPaths];
                  updatedApiPaths[index].selectedEnvironment = 'DEVQA';
                  setApiPaths(updatedApiPaths);
                }}
              />
              DEVQA
            </label>
            <label>
              <input
                type="radio"
                value="AAT"
                checked={item.selectedEnvironment === 'AAT'}
                onChange={() => {
                  const updatedApiPaths = [...apiPaths];
                  updatedApiPaths[index].selectedEnvironment = 'AAT';
                  setApiPaths(updatedApiPaths);
                }}
              />
              AAT
            </label>
                      </div>
          <br />

          <label>
            Param Value:
            {item.params.map((param, paramIndex) => (
              <div key={paramIndex}>
                <input
                  type="text"
                  value={param}
                  onChange={(e) => {
                    const updatedApiPaths = [...apiPaths];
                    updatedApiPaths[index].paramValue[paramIndex] = e.target.value;
                    setApiPaths(updatedApiPaths);
                  }}
                />
              </div>
            ))}
            <button onClick={() => handleAddApiParams(index)}>Add Api Params +</button>
          </label>
          <br />
        </div>
      ))}
    </div>


      </div>
    </Container >
  );
};

export default EditApiPage;
