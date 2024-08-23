import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import ReactJson from "react-json-view";
import {
  environments,
  httpMethods,
  getSelectedApiParams,
  getSelectedApiMethod,
} from "./utils";

const ApiParameterEditor = ({
  currentApiObject,
  setCurrentApiObject,
  selectedPath,
  currentEnv,
  setCurrentEnv,
}) => {
  const [newParamKey, setNewParamKey] = useState("");
  const [newParamValue, setNewParamValue] = useState("");

  const handleAddParam = () => {
    if (newParamKey && newParamValue && selectedPath) {
      setCurrentApiObject((prevState) => {
        const updatedApis = prevState.apis.map((api) => {
          if (api.path === selectedPath) {
            return {
              ...api,
              params: {
                ...api.params,
                [currentEnv]: {
                  ...(api.params[currentEnv] || {}),
                  [newParamKey]: newParamValue,
                },
              },
            };
          }
          return api;
        });
        return { ...prevState, apis: updatedApis };
      });
      setNewParamKey("");
      setNewParamValue("");
    }
  };

  const handleMethodChange = (event) => {
    const newMethod = event.target.value;
    setCurrentApiObject((prevState) => ({
      ...prevState,
      apis: prevState.apis.map((api) =>
        api.path === selectedPath ? { ...api, method: newMethod } : api
      ),
    }));
  };

  return (
    <Box width="63%" pl={2}>
      <Typography variant="h6" gutterBottom>
        Edit Parameters for:
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            padding: "8px 16px",
            borderRadius: "4px",
            display: "inline-block",
            mr: 2,
          }}
        >
          {selectedPath}
        </Typography>
        <Select
          value={getSelectedApiMethod(currentApiObject, selectedPath)}
          onChange={handleMethodChange}
          size="small"
        >
          {httpMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Tabs
        value={currentEnv}
        onChange={(_, newValue) => setCurrentEnv(newValue)}
        sx={{ mb: 2 }}
      >
        {environments.map((env) => (
          <Tab key={env} label={env} value={env} />
        ))}
      </Tabs>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={5}>
          <TextField
            label="Parameter Key"
            value={newParamKey}
            onChange={(e) => setNewParamKey(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Parameter Value"
            value={newParamValue}
            onChange={(e) => setNewParamValue(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddParam}
            fullWidth
            sx={{ height: "100%" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" gutterBottom>
        Current Parameters for {currentEnv}:
      </Typography>
      <Paper
        elevation={3}
        sx={{ p: 2, mb: 2, maxHeight: "350px", overflowY: "auto" }}
      >
        <ReactJson
          src={getSelectedApiParams(currentApiObject, selectedPath, currentEnv)}
          displayDataTypes={false}
          name={null}
          enableClipboard={false}
          onEdit={(edit) => {
            setCurrentApiObject((prevState) => ({
              ...prevState,
              apis: prevState.apis.map((api) =>
                api.path === selectedPath
                  ? {
                      ...api,
                      params: {
                        ...api.params,
                        [currentEnv]: edit.updated_src,
                      },
                    }
                  : api
              ),
            }));
          }}
          onDelete={(deleteEdit) => {
            setCurrentApiObject((prevState) => ({
              ...prevState,
              apis: prevState.apis.map((api) =>
                api.path === selectedPath
                  ? {
                      ...api,
                      params: {
                        ...api.params,
                        [currentEnv]: deleteEdit.updated_src,
                      },
                    }
                  : api
              ),
            }));
          }}
          onAdd={(addEdit) => {
            setCurrentApiObject((prevState) => ({
              ...prevState,
              apis: prevState.apis.map((api) =>
                api.path === selectedPath
                  ? {
                      ...api,
                      params: {
                        ...api.params,
                        [currentEnv]: addEdit.updated_src,
                      },
                    }
                  : api
              ),
            }));
          }}
          style={{ textAlign: "left" }}
        />
      </Paper>
    </Box>
  );
};

export default ApiParameterEditor;
