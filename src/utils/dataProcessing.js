// src/utils/dataProcessing.js

export const getResponseTimeCounts = (selectedEnvironments, responseTimes) => {
    const counts = { 'Below 10s': 0, '10s to 30s': 0, 'Above 30s': 0 };
    selectedEnvironments.forEach(env => {
      Object.values(responseTimes[env]).forEach(time => {
        if (time < 10000) counts['Below 10s']++;
        else if (time < 30000) counts['10s to 30s']++;
        else counts['Above 30s']++;
      });
    });
    return counts;
  };
  
  export const getStatusCounts = (selectedEnvironments, status) => {
    const counts = { Success: 0, Fail: 0 };
    selectedEnvironments.forEach(env => {
      Object.values(status[env]).forEach(status => {
        if (status === 'Success') counts.Success++;
        else if (status.startsWith('Fail')) counts.Fail++;
      });
    });
    return counts;
  };
  
  export const getStatusCodeCounts = (selectedEnvironments, statusCodes) => {
    const counts = {};
    selectedEnvironments.forEach(env => {
      Object.values(statusCodes[env]).forEach(code => {
        counts[code] = (counts[code] || 0) + 1;
      });
    });
    return counts;
  };