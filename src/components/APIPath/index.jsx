import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Chip, Tabs, Tab, Box } from "@mui/material";
import ReactJson from 'react-json-view';
import { updateApiParams } from "store/slices/apiSlices";
import { callAPI } from "store/actions/apiAction";

const getStatusColor = (status) => {
  if (status.startsWith('Fail')) return 'error';
  return status === 'Success' ? 'success' : status === 'loading' ? 'warning' : 'default';
};

const APIPath = ({ path }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { responses, status: statuses, params, selectedEnvironments } = useSelector((state) => state.api);
  const [selectedEnvironment, setSelectedEnvironment] = useState(selectedEnvironments[0] || '');

  const response = responses[selectedEnvironment]?.[path];
  const allStatuses = selectedEnvironments.map(env => statuses[env]?.[path] || 'not-tested');
  const overallStatus = allStatuses.some(status => status.startsWith('Fail')) 
    ? 'Fail' 
    : allStatuses.every(status => status === 'Success') 
      ? 'Success' 
      : allStatuses.some(status => status === 'loading') 
        ? 'loading' 
        : 'not-tested';

  const handleParamChange = useCallback((edit) => {
    dispatch(updateApiParams({ path, params: { ...params[path], [edit.name]: edit.new_value } }));
  }, [dispatch, path, params]);

  useEffect(() => {
    if (selectedEnvironments.length > 0 && !selectedEnvironments.includes(selectedEnvironment)) {
      setSelectedEnvironment(selectedEnvironments[0]);
    }
  }, [selectedEnvironments, selectedEnvironment]);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Typography>{path}</Typography>
          </Grid>
          <Grid item>
            <Chip label={overallStatus} color={getStatusColor(overallStatus)} size="small" />
          </Grid>
        </Grid>
      </AccordionSummary>
      {expanded && (
        <AccordionDetails>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="subtitle1" gutterBottom>Params:</Typography>
            <Box alignSelf="flex-start" width="100%" mb={2}>
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
                enableClipboard={false}
                name={null}
              />
            </Box>
            <Typography variant="subtitle1" gutterBottom>Response:</Typography>
            {selectedEnvironments.length > 0 && (
              <>
                <Tabs value={selectedEnvironment} onChange={(_, newEnvironment) => setSelectedEnvironment(newEnvironment)}>
                  {selectedEnvironments.map(env => (
                    <Tab key={env} label={env} value={env} />
                  ))}
                </Tabs>
                <Box alignSelf="flex-start" width="100%" mt={2}>
                  <ReactJson 
                    src={response || { message: "No response yet" }}
                    displayDataTypes={false}
                    enableClipboard={false}
                    name={null}
                    collapsed={1}
                    theme="monokai"
                  />
                </Box>
              </>
            )}
          </Box>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default APIPath;