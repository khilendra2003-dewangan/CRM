import axios from "axios";
import API_BASE_URL from "../config/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending and receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
