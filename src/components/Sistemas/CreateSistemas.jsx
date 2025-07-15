import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getClientes } from "../../store/apis/clientesApi";
import { getUsuarios } from "../../store/apis/usuariosApi";
import { getCategorias } from "../../store/apis/categoriasApi";
import { createSistema, updateSistema } from "../../store/apis/sistemasApi";

const CreateSistemas = ({ sistema, onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    fechaDesde: "",
    fechaHasta: "",
    clienteId: "",
    usuarios: [],
  });
  const [categoriasHoras, setCategoriasHoras] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => getClientes(token).then(res => res.data),
    enabled: !!token,
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => getUsuarios({ limit: 1000 }, token).then(res => res.data.users ?? []),
    enabled: !!token,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategorias(token).then(res => res.data),
    enabled: !!token,
  });

  const usuariosDelCliente = Array.isArray(usuarios)
    ? usuarios.filter((u) => String(u.clienteId) === String(form.clienteId))
    : [];

  useEffect(() => {
    if (sistema) {
      setForm({
        nombre: sistema.nombre || "",
        fechaDesde: sistema.fechaDesde ? sistema.fechaDesde.slice(0, 10) : "",
        fechaHasta: sistema.fechaHasta ? sistema.fechaHasta.slice(0, 10) : "",
        clienteId: sistema.clienteId || "",
        usuarios: sistema.usuarios ? sistema.usuarios.map(u => String(u.id)) : [],
      });
      setCategoriasHoras(
        sistema.Categoria
          ? sistema.Categoria.map(cat => ({
              categoriaId: cat.id,
              horasContratadas: cat.SistemaCategoriaHoras?.horasContratadas ?? ""
            }))
          : []
      );
    } else {
      setCategoriasHoras([]);
    }
  }, [sistema]);

  useEffect(() => {
    if (!sistema && form.clienteId) {
      setForm((prev) => ({
        ...prev,
        usuarios: [],
      }));
    }
  }, [form.clienteId, sistema]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (sistema) {
        return updateSistema(sistema.id, data, token);
      } else {
        return createSistema(data, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sistemas"]);
      onClose();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUsuariosChange = (e) => {
    setForm((prev) => ({
      ...prev,
      usuarios: e.target.value,
    }));
  };

  const handleCategoriaChange = (idx, field, value) => {
    setCategoriasHoras(prev =>
      prev.map((ch, i) => i === idx ? { ...ch, [field]: value } : ch)
    );
  };

  const handleAddCategoria = () => {
    setCategoriasHoras(prev => [...prev, { categoriaId: "", horasContratadas: "" }]);
  };

  const handleRemoveCategoria = (idx) => {
    setCategoriasHoras(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      categoriasHoras: categoriasHoras.filter(ch => ch.categoriaId && ch.horasContratadas)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Fecha Desde"
          name="fechaDesde"
          type="date"
          value={form.fechaDesde}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha Hasta"
          name="fechaHasta"
          type="date"
          value={form.fechaHasta}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl required>
          <InputLabel id="cliente-label">Cliente</InputLabel>
          <Select
            labelId="cliente-label"
            name="clienteId"
            value={form.clienteId}
            label="Cliente"
            onChange={handleChange}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle1">Categorías y Horas Contratadas</Typography>
        {categoriasHoras.map((ch, idx) => (
          <Box key={idx} display="flex" gap={2} alignItems="center">
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id={`categoria-label-${idx}`}>Categoría</InputLabel>
              <Select
                labelId={`categoria-label-${idx}`}
                value={ch.categoriaId}
                label="Categoría"
                onChange={e => handleCategoriaChange(idx, "categoriaId", e.target.value)}
              >
                {categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Horas Contratadas"
              type="number"
              value={ch.horasContratadas}
              onChange={e => handleCategoriaChange(idx, "horasContratadas", e.target.value)}
              required
            />
            <Button onClick={() => handleRemoveCategoria(idx)} color="error">Quitar</Button>
          </Box>
        ))}
        <Button onClick={handleAddCategoria} variant="outlined">Agregar Categoría</Button>
        <FormControl>
          <InputLabel id="usuarios-label">Usuarios asignados</InputLabel>
          <Select
            labelId="usuarios-label"
            name="usuarios"
            multiple
            value={form.usuarios}
            onChange={handleUsuariosChange}
            renderValue={(selected) =>
              usuariosDelCliente
                .filter(u => selected.includes(String(u.id)))
                .map(u => u.nombre)
                .join(", ")
            }
          >
            {usuariosDelCliente.map((u) => (
              <MenuItem key={u.id} value={String(u.id)}>
                {u.nombre} {u.apellido}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {sistema ? "Guardar" : "Crear"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default CreateSistemas;