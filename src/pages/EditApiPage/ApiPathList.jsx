import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { httpMethods, environments } from "./utils";

const ApiPathList = ({
  currentApiObject,
  setCurrentApiObject,
  selectedPath,
  setSelectedPath,
}) => {
  const [newPath, setNewPath] = useState("");
  const [newMethod, setNewMethod] = useState("GET");

  const handleAddPath = () => {
    if (newPath) {
      setCurrentApiObject((prevState) => ({
        ...prevState,
        apis: [
          ...prevState.apis,
          {
            path: newPath,
            method: newMethod,
            params: environments.reduce(
              (acc, env) => ({ ...acc, [env]: {} }),
              {}
            ),
          },
        ],
      }));
      setSelectedPath(newPath);
      setNewPath("");
      setNewMethod("GET");
    }
  };

  const handleDeletePath = (index) => {
    setCurrentApiObject((prevState) => {
      const updatedApis = prevState.apis.filter((_, i) => i !== index);
      if (
        updatedApis.length > 0 &&
        selectedPath === prevState.apis[index].path
      ) {
        setSelectedPath(updatedApis[0].path);
      }
      return { ...prevState, apis: updatedApis };
    });
  };

  return (
    <Box width="37%" pr={2}>
      <Typography variant="h6" gutterBottom>
        API Paths
      </Typography>
      <List sx={{ maxHeight: "500px", overflowY: "auto", mb: 2 }}>
        {currentApiObject.apis.map((api, index) => (
          <ListItem
            key={index}
            onClick={() => setSelectedPath(api.path)}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedPath === api.path ? "action.selected" : "inherit",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Chip
              label={api.method}
              color={api.method === "GET" ? "primary" : "secondary"}
              size="small"
              sx={{ mr: 1, minWidth: 50 }}
            />
            <ListItemText primary={api.path} />
            <IconButton onClick={() => handleDeletePath(index)} size="small">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Select
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              fullWidth
              size="small"
            >
              {httpMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={9}>
            <TextField
              label="New API Path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPath}
          startIcon={<AddIcon />}
          fullWidth
          sx={{ mt: 1 }}
        >
          Add Path
        </Button>
      </Box>
    </Box>
  );
};

export default ApiPathList;
