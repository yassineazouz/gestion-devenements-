import axios from './axiosInstance';

export const markPresence = (data) => axios.post('/presences', data);
export const getPresenceByEvent = (eventId) => axios.get(`/presences/event/${eventId}`);
