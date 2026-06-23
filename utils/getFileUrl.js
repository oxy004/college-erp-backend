const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getFileUrl = (
  file
) => {
  if (!file) return "";

  return file.startsWith(
    "http"
  )
    ? file
    : `${API_URL}${file}`;
};