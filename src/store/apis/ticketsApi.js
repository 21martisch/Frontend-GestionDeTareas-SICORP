import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTickets = (params, token) =>
  axios.get(`${API_URL}/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const getTicketById = (ticketId, token) =>
  axios.get(`${API_URL}/tickets/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTicket = (data, token) =>
  axios.post(`${API_URL}/tickets`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTicket = (ticketId, data, token) =>
  axios.put(`${API_URL}/tickets/${ticketId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTicket = (ticketId, token) =>
  axios.delete(`${API_URL}/tickets/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const tomarOReasignarTicket = (ticketId, usuarioId, token) =>
  axios.patch(
    `${API_URL}/tickets/${ticketId}/tomar-o-reasignar`,
    { usuarioId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const cambiarCategoria = (ticketId, categoriaId, token) =>
  axios.put(
    `${API_URL}/tickets/${ticketId}`,
    { categoriaId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateHoras = (id, horasCargadas, token, forzar = false) =>
  axios.put(`${API_URL}/tickets/${id}/horas`, { horasCargadas, forzar }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getHistorial = (ticketId, token) =>
  axios.get(`${API_URL}/tickets/${ticketId}/historial`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getComentarios = (ticketId, token) =>
  axios.get(`${API_URL}/tickets/${ticketId}/comentarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addComentario = (ticketId, texto, token, parentId = null) =>
  axios.post(
    `${API_URL}/tickets/${ticketId}/comentarios`,
    parentId ? { texto, parentId } : { texto },
    { headers: { Authorization: `Bearer ${token}` } }
  );