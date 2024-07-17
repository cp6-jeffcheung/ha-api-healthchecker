import React from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import PrettifiedJSON from "components/PrettifiedJSON/PrettifiedJSON";
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Grid,
  Chip
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status) {
    case 'passed':
      //green
      return 'success';
    case 'failed':
      //red
      return 'error';
    case 'not-tested':
      //grey
    default:
      return 'default';
  }
};


// path: '/api-path'
// status: 'not-tested', 'passed', 'failed'
const APIPath = ({ path, params, status }) => {
  const responses = useSelector((state) => state.api.responses);
  const response = get(responses, path, "");

  

  return (
    <Accordion slotProps={{ transition: { timeout: 200 } }}>
      
      <AccordionSummary
        //expandIcon={<ExpandMoreIcon />}
          
        aria-controls={`${path}-content`}
        id={`${path}-header`}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Typography>{path}</Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={status} 
              color={getStatusColor(status)} 
              size="small" 
            />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Params:
            </Typography>
            <PrettifiedJSON data={params} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Response:
            </Typography>
            <PrettifiedJSON data={response} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default APIPath;
