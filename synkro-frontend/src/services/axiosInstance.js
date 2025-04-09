// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // mets le bon port de ton backend
  withCredentials: true, // si tu as de l'auth via cookie
});

export default axiosInstance;
