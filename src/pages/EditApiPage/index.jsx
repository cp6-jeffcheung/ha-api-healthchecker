import React, { useRef, useState, useEffect } from "react";
import { Container, Box, Button, Stack, Paper } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { parseApiJson, exportJson } from "./utils";
import ApiPathList from "./ApiPathList";
import ApiParameterEditor from "./ApiParameterEditor";

const EditApiPage = ({ apiJson, setApiJson, setApiConfig, setSnackbar }) => {
  const fileInputRef = useRef(null);
  const [currentApiObject, setCurrentApiObject] = useState({ apis: [] });
  const [currentEnv, setCurrentEnv] = useState("SIT");
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    setCurrentApiObject(parseApiJson(apiJson));
  }, [apiJson]);

  useEffect(() => {
    if (currentApiObject.apis.length > 0 && !selectedPath) {
      setSelectedPath(currentApiObject.apis[0].path);
    }
  }, [currentApiObject.apis, selectedPath]);

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
    exportJson(currentApiObject);
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

  return (
    <Container maxWidth={false} sx={{ maxWidth: "2000px" }}>
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box display="flex">
            <ApiPathList
              currentApiObject={currentApiObject}
              setCurrentApiObject={setCurrentApiObject}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
            />
            <ApiParameterEditor
              currentApiObject={currentApiObject}
              setCurrentApiObject={setCurrentApiObject}
              selectedPath={selectedPath}
              currentEnv={currentEnv}
              setCurrentEnv={setCurrentEnv}
            />
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