import axios from "axios";
import { API_URL } from "../config";
import { getStoredUser } from "../utils/storage";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

API.interceptors.request.use((config) => {
  const user = getStoredUser();
  const token = user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
