// services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  console.log("🔐 loginUser res.data:", res.data); 
  const user = res.data.user;

  // ✅ Store user info safely after login
  localStorage.setItem("userNom", user.nom);
  localStorage.setItem("userPrenom", user.prenom);
  localStorage.setItem("userToken", res.data.token);
  localStorage.setItem("userId", user._id);

  return res.data;
};
