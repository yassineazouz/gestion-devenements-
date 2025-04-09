import axios from 'axios';

const API = 'http://localhost:5001/api/events';

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const res = await axios.post(API, eventData, config);
  return res.data;
};
