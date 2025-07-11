import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Box, TextField, Button, MenuItem, Alert, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";

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

const extensionesPermitidas = [
  "pdf", "jpg", "jpeg", "png", "xls", "xlsx", "doc", "docx"
];
const maxFileSize = 5 * 1024 * 1024;

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
  const usuario = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  const clienteIdFinal = clientes.length > 0 ? clienteId : usuario?.user?.clienteId;

  const sistemasFiltrados = clienteIdFinal
    ? sistemas.filter(
        s =>
          String(s.clienteId) === String(clienteIdFinal) &&
          (
            usuario?.user?.rol === "admin" ||
            (
              Array.isArray(s.usuarios) &&
              s.usuarios.some(u => String(u.id) === String(usuario.user.id))
            )
          )
      )
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

  const handleArchivosChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    let error = "";

    const nombresActuales = archivosAdjuntos.map(f => f.name);
    const archivosSinDuplicados = nuevosArchivos.filter(f => !nombresActuales.includes(f.name));
    if (archivosSinDuplicados.length < nuevosArchivos.length) {
      error = "Algunos archivos ya fueron seleccionados.";
    }

    for (let file of archivosSinDuplicados) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (!extensionesPermitidas.includes(ext)) {
        error = "Tipo de archivo no permitido.";
        break;
      }
      if (file.size > maxFileSize) {
        error = "El archivo supera el tamaño máximo permitido (5MB).";
        break;
      }
    }

    if (error) {
      setAlerta(error);
      return;
    }
    setArchivosAdjuntos(prev => [...prev, ...archivosSinDuplicados]);
    setAlerta("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !sistemaId) {
      setAlerta("Debes completar el título y seleccionar un sistema.");
      return;
    }
    setAlerta("");
    setLoading(true);
    try {
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
      if (clientes.length > 0 && clienteId) {
        formData.append("clienteId", clienteId);
      } else if (usuario?.rol === "cliente" && usuario?.clienteId) {
        formData.append("clienteId", usuario.clienteId);
      }

      await handleSubmit(formData);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveArchivo = (index) => {
    setArchivosAdjuntos(prev => prev.filter((_, i) => i !== index));
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
          width: 750,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        encType="multipart/form-data"
      >
        {alerta && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {alerta}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={clientes.length > 0 ? 6 : 12}>
            <TextField
              fullWidth
              margin="normal"
              label="Título del ticket"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Grid>
          {clientes.length > 0 && (
            <Grid item xs={12} sm={6}>
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
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
                onChange={handleArchivosChange}
              />
            </Button>
            {archivosAdjuntos && archivosAdjuntos.length > 0 && (
              <Box
                sx={{
                  mb: 2,
                  maxHeight: 120,
                  overflowY: 'auto',
                  border: '1px solid #eee',
                  borderRadius: 1,
                  p: 1,
                  background: '#fafafa'
                }}
              >
                {archivosAdjuntos.map((file, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveArchivo(idx)}
                      sx={{ ml: 1 }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              multiline
              minRows={3}
              maxRows={8}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
              loadingIndicator={
                initialTicket
                  ? "Actualizando..."
                  : "Agregando..."
              }
            >
              {initialTicket ? "Actualizar ticket" : "Agregar ticket"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default TicketModal;