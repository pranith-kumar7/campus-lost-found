import { API_BASE_URL } from "../config";

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

export const mediaUrl = (path) => {
  if (!path) return "";
  if (isAbsoluteUrl(path)) return path;
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
};
