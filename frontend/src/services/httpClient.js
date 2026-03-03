import axios from "axios";
import { LOCAL_KEYS } from "../utils/constants";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
