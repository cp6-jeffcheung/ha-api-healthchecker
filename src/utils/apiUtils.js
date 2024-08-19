export const getStatusColor = (status) => {
  if (status === "not-tested") return "default";
  if (status === "error") return "error";
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "info";
  if (status >= 400 && status < 500) return "warning";
  return "error";
};

export const isValidResponse = (response) => {
  if (!response) return false;
  if (response.ERROR && response.ERROR.message) return false;
  if (
    typeof response === "string" &&
    response.includes("Error while extracting response")
  )
    return false;
  return true;
};

export const truncateValue = (value, maxLength = 50) => {
  if (typeof value === "string" && value.length > maxLength) {
    return value.substring(0, maxLength) + "...";
  }
  return value;
};

export const exportToJson = (data, fileName) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${fileName}.json`;
  link.click();
};
