import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getSistemas } from "../../store/apis/sistemasApi";
import { createCliente, updateCliente } from "../../store/apis/clientesApi";

const CreateCliente = ({ cliente, onClose }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    sistemas: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: sistemas = [] } = useQuery({
    queryKey: ["sistemas"],
    queryFn: () => getSistemas({}, token).then(res => res.data),
    enabled: !!token,
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre,
        email: cliente.email,
        sistemas: cliente.Sistemas?.map(s => s.id) || [],
      });
    } else {
      setForm({
        nombre: "",
        email: "",
        sistemas: [],
      });
    }
  }, [cliente]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (cliente) {
        return updateCliente(cliente.id, data, token);
      } else {
        return createCliente(data, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["clientes"]);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Error al guardar cliente");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSistemasChange = (e) => {
    setForm((prev) => ({
      ...prev,
      sistemas: e.target.value, 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    mutation.mutate(form);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Sistemas"
          name="sistemas"
          value={form.sistemas}
          onChange={handleSistemasChange}
          fullWidth
          margin="normal"
          SelectProps={{ multiple: true }}
        >
          {sistemas.map((s) => (
            <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
          ))}
        </TextField>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {cliente ? "Guardar cambios" : "Crear Cliente"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateCliente;