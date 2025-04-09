import axios from './axiosInstance';

export const getAllUsers = () => axios.get('/users');
export const getUserById = (id) => axios.get(`/users/${id}`);
