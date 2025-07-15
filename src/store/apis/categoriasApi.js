import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategorias = (token) => {
  return axios.get(`${API_URL}/categoriasTipo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCategoriaById = (id, token) => {
  return axios.get(`${API_URL}/categoriasTipo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createCategoria = (data, token) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateCategoria = (id, data, token) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteCategoria = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};