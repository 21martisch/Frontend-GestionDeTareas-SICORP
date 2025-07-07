import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getNotificaciones = (token) =>
  axios.get(`${API_URL}/notificaciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const marcarNotificacionesLeidas = (token) =>
  axios.post(`${API_URL}/notificaciones/leer`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const marcarNotificacionLeida = (id, token) =>
  axios.post(`${API_URL}/notificaciones/${id}/leida`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });