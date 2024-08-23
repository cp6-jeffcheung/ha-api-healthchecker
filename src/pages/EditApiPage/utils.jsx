export const environments = ["SIT", "DEVQA", "AAT"];
export const httpMethods = ["GET", "POST"];

export const parseApiJson = (apiJson) => {
  try {
    return JSON.parse(apiJson);
  } catch (error) {
    return { apis: [] };
  }
};

export const getSelectedApiParams = (
  currentApiObject,
  selectedPath,
  currentEnv
) => {
  const selectedApi = currentApiObject.apis.find(
    (api) => api.path === selectedPath
  );
  return selectedApi?.params?.[currentEnv] || {};
};

export const getSelectedApiMethod = (currentApiObject, selectedPath) => {
  const selectedApi = currentApiObject.apis.find(
    (api) => api.path === selectedPath
  );
  return selectedApi?.method || "GET";
};

export const exportJson = (currentApiObject) => {
  const blob = new Blob([JSON.stringify(currentApiObject, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "API.json";
  link.click();
  URL.revokeObjectURL(url);
};
