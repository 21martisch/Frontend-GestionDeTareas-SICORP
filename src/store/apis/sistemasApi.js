import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSistemas = (params, token) =>
  axios.get(`${API_URL}/sistemas`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createSistema = (data, token) =>
  axios.post(`${API_URL}/sistemas`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateSistema = (id, data, token) =>
  axios.put(`${API_URL}/sistemas/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteSistema = (id, token) =>
  axios.delete(`${API_URL}/sistemas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getResumenHorasMensual = (sistemaId, token) =>
  axios.get(`${API_URL}/sistemas/${sistemaId}/resumen-horas-mensual`, {
    headers: { Authorization: `Bearer ${token}` }
  });