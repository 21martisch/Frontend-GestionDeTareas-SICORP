import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem, Alert } from "@mui/material";

const prioridades = [
  { value: "Alta", label: "Alta" },
  { value: "Media", label: "Media" },
  { value: "Baja", label: "Baja" },
];

const categorias = [
  { value: "Soporte", label: "Soporte" },
  { value: "Desarrollo", label: "Desarrollo" },
  { value: "Modificación", label: "Modificación" },
];

const TicketModal = ({
  open,
  handleClose,
  handleSubmit,
  initialTicket,
  sistemas = [],
  clientes = []
}) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sistemaId, setSistemaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
  const [prioridad, setPrioridad] = useState("");
  const [categoriaTipo, setCategoriaTipo] = useState("");
  const [alerta, setAlerta] = useState("");

  const sistemasFiltrados = clienteId
  ? sistemas.filter(s => String(s.clienteId) === String(clienteId))
  : sistemas;
  
  useEffect(() => {
    if (initialTicket) {
      setTitulo(initialTicket.titulo || "");
      setDescripcion(initialTicket.descripcion || "");
      setSistemaId(initialTicket.sistemaId || "");
      setClienteId(initialTicket.clienteId || "");
      setPrioridad(initialTicket.prioridad || "");
      setCategoriaTipo(initialTicket.categoriaTipo || "");
    } else {
      setTitulo("");
      setDescripcion("");
      setSistemaId("");
      setClienteId("");
      setArchivosAdjuntos([]);
      setPrioridad("");
      setCategoriaTipo("");
    }
    setAlerta("");
  }, [initialTicket, open]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !sistemaId) {
      setAlerta("Debes completar el título y seleccionar un sistema.");
      return;
    }
    setAlerta("");
    const formData = new FormData();
    formData.append("titulo", titulo);
    if (descripcion) formData.append("descripcion", descripcion);
    formData.append("sistemaId", sistemaId);
    formData.append("prioridad", prioridad);
    formData.append("categoriaTipo", categoriaTipo);
    if (archivosAdjuntos && archivosAdjuntos.length > 0) {
      archivosAdjuntos.forEach(file => {
        formData.append("archivosAdjuntos", file);
      });
    }
    if (initialTicket?.id) formData.append("id", initialTicket.id);
    if (clientes.length > 0 && clienteId) formData.append("clienteId", clienteId);

    handleSubmit(formData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
        encType="multipart/form-data"
      >
        {alerta && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {alerta}
          </Alert>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Título del ticket"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          multiline
          minRows={3}
        />
        {clientes.length > 0 && (
          <TextField
            select
            fullWidth
            margin="normal"
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          >
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          margin="normal"
          label="Sistema"
          value={sistemaId}
          onChange={(e) => setSistemaId(e.target.value)}
          required
        >
          {sistemasFiltrados.map((s) => (
            <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          margin="normal"
          label="Prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          required
        >
          {prioridades.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          margin="normal"
          label="Categoría"
          value={categoriaTipo}
          onChange={(e) => setCategoriaTipo(e.target.value)}
          required
        >
          {categorias.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
        >
          {archivosAdjuntos && archivosAdjuntos.length > 0
            ? `${archivosAdjuntos.length} archivo(s) seleccionado(s)`
            : "Adjuntar archivos"}
          <input
            type="file"
            hidden
            multiple
            onChange={e => setArchivosAdjuntos(prev => [...prev, ...Array.from(e.target.files)])}
          />
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {initialTicket ? "Actualizar ticket" : "Agregar ticket"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TicketModal;