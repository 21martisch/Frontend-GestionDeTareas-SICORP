import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getClientes
} from "../../store/apis/clientesApi";
import {
  createSistema,
  updateSistema
} from "../../store/apis/sistemasApi"; 

const CreateSistemas = ({ sistema, onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    horasContrato: "",
    fechaDesde: "",
    fechaHasta: "",
    clientes: [],
  });
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => getClientes(token).then(res => res.data),
    enabled: !!token,
  });

  useEffect(() => {
    if (sistema) {
      setForm({
        nombre: sistema.nombre || "",
        horasContrato: sistema.horasContrato || "",
        fechaDesde: sistema.fechaDesde ? sistema.fechaDesde.slice(0, 10) : "",
        fechaHasta: sistema.fechaHasta ? sistema.fechaHasta.slice(0, 10) : "",
        clientes: sistema.Clientes ? sistema.Clientes.map(c => c.id) : [],
      });
    }
  }, [sistema]);

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

  const handleClientesChange = (e) => {
    setForm((prev) => ({
      ...prev,
      clientes: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
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
          label="Horas de Contrato"
          name="horasContrato"
          value={form.horasContrato}
          onChange={handleChange}
          type="number"
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
        <FormControl>
          <InputLabel id="clientes-label">Clientes asociados</InputLabel>
          <Select
            labelId="clientes-label"
            multiple
            value={form.clientes}
            onChange={handleClientesChange}
            renderValue={(selected) =>
              clientes
                .filter((c) => selected.includes(c.id))
                .map((c) => c.nombre)
                .join(", ")
            }
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                <Checkbox checked={form.clientes.includes(cliente.id)} />
                <ListItemText primary={cliente.nombre} />
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