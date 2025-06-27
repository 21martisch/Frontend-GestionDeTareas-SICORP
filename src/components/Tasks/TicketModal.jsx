import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem, Alert } from "@mui/material";

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
  const [archivoAdjunto, setArchivoAdjunto] = useState(null);
  const [alerta, setAlerta] = useState("");

  const sistemasFiltrados = clienteId
    ? sistemas.filter(s =>
        Array.isArray(s.Clientes) &&
        s.Clientes.some(c => String(c.id) === String(clienteId))
      )
    : sistemas;

  useEffect(() => {
    if (initialTicket) {
      setTitulo(initialTicket.titulo || "");
      setDescripcion(initialTicket.descripcion || "");
      setSistemaId(initialTicket.sistemaId || "");
      setClienteId(initialTicket.clienteId || "");
    } else {
      setTitulo("");
      setDescripcion("");
      setSistemaId("");
      setClienteId("");
      setArchivoAdjunto(null);
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
    if (archivoAdjunto) formData.append("archivoAdjunto", archivoAdjunto);
    if (initialTicket?.id) formData.append("id", initialTicket.id);
    if (clientes.length > 0 && clienteId) formData.append("clienteId", clienteId);

    handleSubmit(formData);
    // console.log("Datos enviados:", formData);
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
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
        >
          {archivoAdjunto ? archivoAdjunto.name : "Adjuntar archivo"}
          <input
            type="file"
            hidden
            onChange={(e) => setArchivoAdjunto(e.target.files[0])}
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