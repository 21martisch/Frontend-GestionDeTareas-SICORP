import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getClientes = (token) =>
  axios.get(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getClienteByUser = (userId, token) =>
  axios.get(`${API_URL}/clientes/by-user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCliente = (data, token) =>
  axios.post(`${API_URL}/clientes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCliente = (id, data, token) =>
  axios.put(`${API_URL}/clientes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCliente = (id, token) =>
  axios.delete(`${API_URL}/clientes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const changeClientePassword = (clienteId, password, token) =>
  axios.put(
    `${API_URL}/clientes/${clienteId}/cambiar-password`,
    { password },
    { headers: { Authorization: `Bearer ${token}` } }
  );