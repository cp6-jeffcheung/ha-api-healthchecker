
import React from 'react';
import ReactJson from 'react-json-view';

const JSONViewer = ({ jsonData }) => {
  return <ReactJson src={jsonData} name={false} displayDataTypes={false} enableClipboard={false} />;
};

export default JSONViewer;
