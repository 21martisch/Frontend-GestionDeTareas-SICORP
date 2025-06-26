import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUsuarios = (params, token) =>
  axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createUsuario = (data, token) =>
  axios.post(`${API_URL}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUsuario = (id, data, token) =>
  axios.put(`${API_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUsuario = (id, token) =>
  axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const changeUsuarioPassword = (usuarioId, password, token) =>
  axios.put(
    `${API_URL}/usuarios/${usuarioId}/password`,
    { password },
    { headers: { Authorization: `Bearer ${token}` } }
  );