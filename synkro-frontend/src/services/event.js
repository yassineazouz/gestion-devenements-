import axios from 'axios';

const API = 'http://localhost:5000/api/events';

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const res = await axios.post(API, eventData, config);
  return res.data;
};

export const fetchEvents = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const res = await axios.get(API, config);
  return res.data;
};


export const updateEvent = async (id, updatedData) => {
    const response = await axios.put(`http://localhost:5000/api/events/${id}`, updatedData);
    return response.data;
  };

export const deleteEvent = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};

export const sendInvitation = async (email, eventId) => {
  return axios.post('http://localhost:5000/api/invitations', { email, eventId });
};
