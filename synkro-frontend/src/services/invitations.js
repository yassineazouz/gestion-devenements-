import axios from './axiosInstance';

export const sendInvitation = (data) => axios.post('/invitations', data);
export const getInvitationsByEvent = (eventId) => axios.get(`/invitations/event/${eventId}`);
export const respondToInvitation = (invitationId, status) =>
  axios.put(`/invitations/${invitationId}`, { status });
