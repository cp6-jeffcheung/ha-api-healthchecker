import React from 'react';
import { Box, Typography } from '@mui/material';

const PrettifiedJSON = ({ data }) => {
  const prettifyJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Box sx={{ textAlign: 'left', maxWidth: '100%', overflowX: 'auto' }}>
      <Typography component="pre" sx={{ 
        whiteSpace: 'pre-wrap', 
        wordWrap: 'break-word',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {prettifyJSON(data)}
      </Typography>
    </Box>
  );
};

export default PrettifiedJSON;