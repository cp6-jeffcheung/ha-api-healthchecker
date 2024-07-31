import React, { useState, useCallback, useEffect } from "react";
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
  Tooltip, 
  Paper,
  IconButton,
  useTheme
} from "@mui/material";
import ReactJson from 'react-json-view';
import { updateApiParams } from "store/slices/apiSlices";

const getStatusColor = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) return 'success';
  if (statusCode >= 400 && statusCode < 500) return 'warning';
  if (statusCode >= 500) return 'error';
  return 'default';
};

const APIPath = ({ path }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { responses, statusCodes, responseTimes, params, selectedEnvironments } = useSelector((state) => state.api);
  const [selectedEnvironment, setSelectedEnvironment] = useState(selectedEnvironments[0] || '');

  const response = responses[selectedEnvironment]?.[path];

  const getEnvironmentStatus = (env) => {
    const status = statusCodes[env]?.[path];
    if (status >= 400) return 'error';
    return status;
  };

  const environmentStatuses = {
    SIT: statusCodes.SIT[path],
    PPM: statusCodes.PPM[path],
    AAT: statusCodes.AAT[path]
  };

  const getStatusColor = (status) => {
    if (status === 'not-tested') return 'default';
    if (status === 'error') return 'error';
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'info';
    if (status >= 400 && status < 500) return 'warning';
    return 'error';
  };

  const handleParamChange = useCallback((edit) => {
    dispatch(updateApiParams({ path, params: { ...params[path], [edit.name]: edit.new_value } }));
  }, [dispatch, path, params]);

  useEffect(() => {
    if (selectedEnvironments.length > 0 && !selectedEnvironments.includes(selectedEnvironment)) {
      setSelectedEnvironment(selectedEnvironments[0]);
    }
  }, [selectedEnvironments, selectedEnvironment]);

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden', borderRadius: 2 }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} disableGutters>
        <AccordionSummary sx={{ backgroundColor: theme.palette.grey[100] }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight="medium">{path}</Typography>
            </Grid>
            {['SIT', 'PPM', 'AAT'].map(env => (
              <Grid item xs={4} sm={2} key={env}>
                <Chip 
                  label={`${env}: ${environmentStatuses[env] || 'Not Tested'}`} 
                  color={getStatusColor(environmentStatuses[env])} 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
                {typeof environmentStatuses[env] === 'number' && environmentStatuses[env] >= 200 && environmentStatuses[env] < 300 && (
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    {responseTimes[env]?.[path] || 'N/A'} ms
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </AccordionSummary>
        {expanded && (
          <AccordionDetails sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
              <Box display="flex" alignItems="center" width="100%" mb={1}>
                <Typography variant="h6" gutterBottom>Params:</Typography>
              </Box>
              <Box width="100%" mb={3}>
                <ReactJson 
                  src={params[path] || {}} 
                  onEdit={handleParamChange}
                  onDelete={(remove) => {
                    const updatedParams = { ...params[path] };
                    delete updatedParams[remove.name];
                    dispatch(updateApiParams({ path, params: updatedParams }));
                  }}
                  onAdd={(add) => handleParamChange({ name: add.name, new_value: add.new_value })}
                  displayDataTypes={false}
                  name={null}
                  style={{ textAlign: 'left', backgroundColor: theme.palette.grey[100], padding: '10px', borderRadius: '4px' }}
                />
              </Box>
              <Box display="flex" alignItems="center" width="100%" mb={1}>
                <Typography variant="h6" gutterBottom>Response:</Typography>
              </Box>
              {selectedEnvironments.length > 0 && (
                <Box width="100%">
                  <Tabs 
                    value={selectedEnvironment} 
                    onChange={(_, newEnvironment) => setSelectedEnvironment(newEnvironment)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                  >
                    {selectedEnvironments.map(env => (
                      <Tab key={env} label={env} value={env} />
                    ))}
                  </Tabs>
                  <Box mt={2} width="100%">
                    <ReactJson 
                      src={response || { message: "No response yet" }}
                      displayDataTypes={false}
                      name={null}
                      collapsed={1}
                      theme="monokai"
                      style={{ textAlign: 'left', borderRadius: '4px' }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        )}
      </Accordion>
    </Paper>
  );
};

export default APIPath;