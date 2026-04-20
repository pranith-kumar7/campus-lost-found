// src/api/axios.js
import axios from "axios";
import { API_URL } from "../config";

const API = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT token from localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
