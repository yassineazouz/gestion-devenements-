import axios from './axiosInstance';

export const scheduleNotification = (data) => axios.post('/notifications/schedule', data);
export const getNotifications = () => axios.get('/notifications');
