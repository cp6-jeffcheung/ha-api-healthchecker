import React, { useRef } from "react";
import {Container,Box,Typography,Paper,TextField,Button,Grid} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

const EditApiPage = ({ apiJson, setApiJson, setApiConfig, setSnackbar }) => {
  const fileInputRef = useRef(null);

  const handleApiJsonChange = (event) => {
    setApiJson(event.target.value);
  };

  const handleApiJsonSave = () => {
    try {
      const parsedConfig = JSON.parse(apiJson);
      setApiConfig(parsedConfig);
      setSnackbar({
        open: true,
        message: "API configuration updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Invalid JSON format. Please check your input.",
        severity: "error",
      });
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([apiJson], { type: "application/json" });
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
          <TextField
            multiline
            fullWidth
            rows={20}
            value={apiJson}
            onChange={handleApiJsonChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
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
    </Container>
  );
};

export default EditApiPage;
