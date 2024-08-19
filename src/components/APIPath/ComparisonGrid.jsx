import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ComparisonGrid = ({ title, icon, data, columns, onExport }) => {
  return (
    <Box mt={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">
          {icon}
          {title}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
          size="small"
        >
          Export
        </Button>
      </Box>
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        disableSelectionOnClick
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};

export default ComparisonGrid;
