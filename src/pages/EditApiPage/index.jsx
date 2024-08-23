import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactJson from "react-json-view";

const environments = ["SIT", "DEVQA", "AAT"];

const EditApiPage = ({ apiJson, setApiJson, setApiConfig, setSnackbar }) => {
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [currentApiObject, setCurrentApiObject] = useState({ apis: [] });
  const [currentEnv, setCurrentEnv] = useState("SIT");
  const [selectedPath, setSelectedPath] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newParamKey, setNewParamKey] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [dividerPosition, setDividerPosition] = useState(30);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(apiJson);
      setCurrentApiObject(parsed);
    } catch (error) {
      setCurrentApiObject({ apis: [] });
    }
  }, [apiJson]);

  useEffect(() => {
    if (currentApiObject.apis.length > 0 && !selectedPath) {
      setSelectedPath(currentApiObject.apis[0].path);
    }
  }, [currentApiObject.apis, selectedPath]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setDividerPosition(Math.max(20, Math.min(80, newPosition)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleApiJsonSave = () => {
    try {
      const updatedJson = JSON.stringify(currentApiObject, null, 2);
      setApiConfig(currentApiObject);
      setApiJson(updatedJson);
      setSnackbar({
        open: true,
        message: "API configuration updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating API configuration",
        severity: "error",
      });
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(currentApiObject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "API.json";
    link.click();
    URL.revokeObjectURL(url);
    setSnackbar({
      open: true,
      message: "API configuration exported successfully",
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
          const parsedConfig = JSON.parse(content);
          setCurrentApiObject(parsedConfig);
          setApiJson(JSON.stringify(parsedConfig, null, 2));
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

  const handleAddPath = () => {
    if (newPath) {
      setCurrentApiObject((prevState) => ({
        ...prevState,
        apis: [
          ...prevState.apis,
          {
            path: newPath,
            params: environments.reduce((acc, env) => ({ ...acc, [env]: {} }), {}),
          },
        ],
      }));
      setSelectedPath(newPath);
      setNewPath("");
    }
  };

  const handleDeletePath = (index) => {
    setCurrentApiObject((prevState) => {
      const updatedApis = prevState.apis.filter((_, i) => i !== index);
      if (updatedApis.length > 0 && selectedPath === prevState.apis[index].path) {
        setSelectedPath(updatedApis[0].path);
      }
      return { ...prevState, apis: updatedApis };
    });
  };

  const handleEnvChange = (_, newValue) => {
    setCurrentEnv(newValue);
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
  };

  const getSelectedApiParams = () => {
    const selectedApi = currentApiObject.apis.find((api) => api.path === selectedPath);
    return selectedApi?.params?.[currentEnv] || {};
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }} ref={containerRef}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" position="relative">
            <Box width={`${dividerPosition}%`} pr={2}>
              <Typography variant="h6" gutterBottom>
                API Paths
              </Typography>
              <List sx={{ maxHeight: '500px', overflowY: 'auto', mb: 2 }}>
                {currentApiObject.apis.map((api, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handlePathSelect(api.path)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: selectedPath === api.path ? "action.selected" : "inherit",
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <ListItemText primary={api.path} />
                    <IconButton onClick={() => handleDeletePath(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="New API Path"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPath}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Path
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: `${dividerPosition}%`,
                top: 0,
                bottom: 0,
                width: "4px",
                backgroundColor: "grey.300",
                cursor: "col-resize",
                "&:hover": { backgroundColor: "primary.main" },
              }}
              onMouseDown={() => setIsDragging(true)}
            />
            <Box width={`${100 - dividerPosition}%`} pl={2}>
              <Typography variant="h6" gutterBottom>
                Edit Parameters for:
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold', 
                  color: 'primary.main',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                {selectedPath}
              </Typography>
              <Tabs value={currentEnv} onChange={handleEnvChange} sx={{ mb: 2 }}>
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
                    sx={{ height: '100%' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="subtitle1" gutterBottom>
                Current Parameters for {currentEnv}:
              </Typography>
              <Paper elevation={3} sx={{ p: 2, mb: 2, maxHeight: '350px', overflowY: 'auto' }}>
                <ReactJson
                  src={getSelectedApiParams()}
                  displayDataTypes={false}
                  name={null}
                  enableClipboard={false}
                  onEdit={(edit) => {
                    setCurrentApiObject((prevState) => {
                      const updatedApis = prevState.apis.map((api) => {
                        if (api.path === selectedPath) {
                          return {
                            ...api,
                            params: {
                              ...api.params,
                              [currentEnv]: edit.updated_src,
                            },
                          };
                        }
                        return api;
                      });
                      return { ...prevState, apis: updatedApis };
                    });
                  }}
                  onDelete={(deleteEdit) => {
                    setCurrentApiObject((prevState) => {
                      const updatedApis = prevState.apis.map((api) => {
                        if (api.path === selectedPath) {
                          return {
                            ...api,
                            params: {
                              ...api.params,
                              [currentEnv]: deleteEdit.updated_src,
                            },
                          };
                        }
                        return api;
                      });
                      return { ...prevState, apis: updatedApis };
                    });
                  }}
                  onAdd={(addEdit) => {
                    setCurrentApiObject((prevState) => {
                      const updatedApis = prevState.apis.map((api) => {
                        if (api.path === selectedPath) {
                          return {
                            ...api,
                            params: {
                              ...api.params,
                              [currentEnv]: addEdit.updated_src,
                            },
                          };
                        }
                        return api;
                      });
                      return { ...prevState, apis: updatedApis };
                    });
                  }}
                  style={{ textAlign: 'left' }}
                />
              </Paper>
            </Box>
          </Box>
        </Paper>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleApiJsonSave}
            startIcon={<SaveIcon />}
          >
            Save Configuration
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => fileInputRef.current.click()}
            startIcon={<UploadIcon />}
          >
            Import API.json
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleExportJson}
            startIcon={<DownloadIcon />}
          >
            Export API.json
          </Button>
        </Stack>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImportJson}
        accept=".json"
      />
    </Container>
  );
};

export default EditApiPage;