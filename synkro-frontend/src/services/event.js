import axios from 'axios';

const API = 'http://localhost:5000/api/events';

const getAuthConfig = () => {
  const token = localStorage.getItem('userToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createEvent = async (eventData) => {
  const config = getAuthConfig();
  const res = await axios.post(API, eventData, config);
  return res.data;
};

export const fetchEvents = async () => {
  const config = getAuthConfig();
  const res = await axios.get(API, config);
  return res.data;
};

export const updateEvent = async (id, updatedData) => {
  const config = getAuthConfig();
  const res = await axios.put(`${API}/${id}`, updatedData, config);
  return res.data;
};

export const deleteEvent = async (id) => {
  const config = getAuthConfig();
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};

export const sendInvitation = async (email, eventId) => {
  const config = getAuthConfig();
  const res = await axios.post('http://localhost:5000/api/invitations', { email, eventId }, config);
  return res.data;
};
