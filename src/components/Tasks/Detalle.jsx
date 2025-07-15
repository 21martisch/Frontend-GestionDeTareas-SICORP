import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Modal,
  Divider,
  Grid,
  Avatar,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Visibility, AccountCircle, Send, AttachFile } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import useAuth from "../../hooks/useAuth";
import {
  getTicketById,
  getComentarios,
  addComentario,
  getArchivoUrlFirmada
} from "../../store/apis/ticketsApi";

const getCategoriaChipStyle = (nombre) => {
  switch (nombre) {
    case "Abierto":
      return { backgroundColor: "#A8E6CF", color: "#2e5d6b" };
    case "En Proceso":
      return { backgroundColor: "#B3E5FC", color: "#2e5d6b" };
    case "Cerrado":
      return { backgroundColor: "#E0E0E0", color: "#2e5d6b" };
    case "Esperando Respuesta":
      return { backgroundColor: "#FFF9C4", color: "#2e5d6b" };
    default:
      return { backgroundColor: "#F5F5F5", color: "#2e5d6b" };
  }
};

const extensionesPermitidas = [
  "pdf", "jpg", "jpeg", "png", "xls", "xlsx", "doc", "docx"
];
const maxFileSize = 5 * 1024 * 1024;

const Detalle = (props) => {
  const params = useParams();
  const ticketId = props.ticketId || params.ticketId;
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
  const [alertaComentario, setAlertaComentario] = useState("");
  const [responderA, setResponderA] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");
  const [archivoModalOpen, setArchivoModalOpen] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [archivoSeleccionadoKey, setArchivoSeleccionadoKey] = useState(null);
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [loadingRespuesta, setLoadingRespuesta] = useState(false);

  // Para archivos en respuestas
  const [archivosRespuesta, setArchivosRespuesta] = useState({});
  const [alertaRespuesta, setAlertaRespuesta] = useState({});

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await getTicketById(ticketId, token);
        setTicket(data);
      } catch (error) {
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) fetchTicket();
  }, [ticketId, token]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const { data } = await getComentarios(ticketId, token);
        setComentarios(data);
      } catch (error) {
        setComentarios([]);
      }
    };
    if (ticketId) fetchComentarios();
  }, [ticketId, token]);

  const handleArchivosComentarioChange = (e) => {
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
      setAlertaComentario(error);
      return;
    }
    setArchivosAdjuntos(prev => [...prev, ...archivosSinDuplicados]);
    setAlertaComentario("");
  };

  const handleRemoveArchivoComentario = (index) => {
    setArchivosAdjuntos(prev => prev.filter((_, i) => i !== index));
  };

  // Archivos para respuestas
  const handleArchivosRespuestaChange = (e, comentarioId) => {
    const nuevosArchivos = Array.from(e.target.files);
    let error = "";

    const actuales = archivosRespuesta[comentarioId] || [];
    const nombresActuales = actuales.map(f => f.name);
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
      setAlertaRespuesta(prev => ({ ...prev, [comentarioId]: error }));
      return;
    }
    setArchivosRespuesta(prev => ({
      ...prev,
      [comentarioId]: [...actuales, ...archivosSinDuplicados]
    }));
    setAlertaRespuesta(prev => ({ ...prev, [comentarioId]: "" }));
  };

  const handleRemoveArchivoRespuesta = (comentarioId, index) => {
    setArchivosRespuesta(prev => ({
      ...prev,
      [comentarioId]: prev[comentarioId].filter((_, i) => i !== index)
    }));
  };

  const handleNuevoComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setLoadingComentario(true);
    try {
      const formData = new FormData();
      formData.append("texto", nuevoComentario);
      archivosAdjuntos.forEach(file => {
        formData.append("archivosAdjuntos", file);
      });

      const { data } = await addComentario(ticketId, formData, token);
      setComentarios([...comentarios, data.comentario]);
      setNuevoComentario("");
      setArchivosAdjuntos([]);
    } catch (error) {}
    setLoadingComentario(false);
  };

  const handleResponderComentario = async (e) => {
    e.preventDefault();
    if (!textoRespuesta.trim()) return;
    setLoadingRespuesta(true);
    try {
      const formData = new FormData();
      formData.append("texto", textoRespuesta);
      formData.append("parentId", responderA);
      if (archivosRespuesta[responderA] && archivosRespuesta[responderA].length > 0) {
        archivosRespuesta[responderA].forEach(file => {
          formData.append("archivosAdjuntos", file);
        });
      }
      const { data } = await addComentario(ticketId, formData, token, responderA);
      setComentarios(comentarios.map(com =>
        com.id === responderA
          ? { ...com, Respuestas: [...(com.Respuestas || []), data.comentario] }
          : com
      ));
      setTextoRespuesta("");
      setResponderA(null);
      setArchivosRespuesta(prev => ({ ...prev, [responderA]: [] }));
    } catch (error) {}
    setLoadingRespuesta(false);
  };

  const handleVerArchivo = async (key) => {
    try {
      const { data } = await getArchivoUrlFirmada(key, token);
      setArchivoSeleccionado(data.url);
      setArchivoSeleccionadoKey(key);
      setArchivoModalOpen(true);
    } catch (error) {
      alert("No se pudo obtener el archivo.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6" color="error">Ticket no encontrado</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{ticket.titulo}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(ticket.fechaCreacion).toLocaleDateString()}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Cliente:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{ticket.Cliente?.nombre || "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Usuario:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{ticket.Usuario?.nombre || "-"} {ticket.Usuario?.apellido}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Sistema:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{ticket.Sistema?.nombre || "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Estado:</Typography>
              <Chip
                label={ticket.Estado?.nombre || "-"}
                sx={getCategoriaChipStyle(ticket.Estado?.nombre)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Prioridad:</Typography>
              <Chip
                label={ticket.prioridad || "-"}
                size="small"
                color={
                  ticket.prioridad === "Alta"
                    ? "error"
                    : ticket.prioridad === "Media"
                    ? "warning"
                    : "success"
                }
                sx={{ fontWeight: 500 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Categoría:</Typography>
              <Chip
                label={ticket.Categorium?.nombre || "-"}
                size="small"
                color="primary"
                sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#1976d2" }}
              />
            </Grid>
            {ticket.tomado && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Tomado por:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{ticket.usuarioAsignado || "-"}</Typography>
              </Grid>
            )}
            {ticket.fechaCierre && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Fecha de cierre:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{ticket.fechaCierre ? new Date(ticket.fechaCierre).toLocaleDateString() : "-"}</Typography>
              </Grid>
            )}
          </Grid>
          {ticket.descripcion && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Descripción:</Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>{ticket.descripcion}</Typography>
            </Box>
          )}
          {ticket.archivosAdjuntos && ticket.archivosAdjuntos.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                Archivos adjuntos:
              </Typography>
              <List dense sx={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", borderRadius: 1 }}>
                {ticket.archivosAdjuntos.map((key, idx) => {
                  const nombre = decodeURIComponent(key.split("/").pop());
                  return (
                    <ListItem key={key} divider>
                      <ListItemText primary={nombre} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleVerArchivo(key)}>
                          <Visibility />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Comentarios</Typography>
            <Paper sx={{ maxHeight: 300, overflowY: "auto", p: 2, mb: 2, background: "#fafafa" }}>
              {comentarios.length === 0 && (
                <Typography variant="body2" color="textSecondary">No hay comentarios aún.</Typography>
              )}
              {comentarios.map(com => (
                <Box key={com.id} sx={{ mb: 2, pl: 0 }}>
                  <Paper sx={{ p: 2, display: "flex", alignItems: "flex-start", mb: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: "#1976d2" }}>
                      <AccountCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{com.Usuario?.nombre || "Usuario"}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                          maxWidth: "100%",
                          overflowWrap: "break-word"
                        }}
                      >
                        {com.texto}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(com.fecha).toLocaleString()}
                      </Typography>
                      {com.archivosAdjuntos && com.archivosAdjuntos.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {com.archivosAdjuntos.map((archivo, idx) => (
                            <Button
                              key={idx}
                              size="small"
                              startIcon={<AttachFileIcon />}
                              onClick={() => handleVerArchivo(archivo)}
                              sx={{ textTransform: "none", mr: 1 }}
                            >
                              {decodeURIComponent(archivo.split("/").pop())}
                            </Button>
                          ))}
                        </Box>
                      )}
                      <Button size="small" onClick={() => setResponderA(com.id)}>Responder</Button>
                    </Box>
                  </Paper>
                  {com.Respuestas && com.Respuestas.map(resp => (
                    <Box key={resp.id} sx={{ ml: 8, mt: 1 }}>
                      <Paper sx={{ p: 2, background: "#f5f5f5", display: "flex", alignItems: "flex-start" }}>
                        <Avatar sx={{ mr: 2, bgcolor: "#90caf9" }}>
                          <AccountCircle />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{resp.Usuario?.nombre || "Usuario"}</Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              wordBreak: "break-word",
                              whiteSpace: "pre-line",
                              maxWidth: "100%",
                              overflowWrap: "break-word"
                            }}
                          >
                            {resp.texto}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(resp.fecha).toLocaleString()}
                          </Typography>
                          {resp.archivosAdjuntos && resp.archivosAdjuntos.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              {resp.archivosAdjuntos.map((archivo, idx) => (
                                <Button
                                  key={idx}
                                  size="small"
                                  startIcon={<AttachFileIcon />}
                                  onClick={() => handleVerArchivo(archivo)}
                                  sx={{ textTransform: "none", mr: 1 }}
                                >
                                  {decodeURIComponent(archivo.split("/").pop())}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                  {responderA === com.id && (
                    <Box component="form" onSubmit={handleResponderComentario} sx={{ mt: 1, ml: 8 }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={textoRespuesta}
                        onChange={e => setTextoRespuesta(e.target.value)}
                        placeholder="Escribe una respuesta..."
                      />
                      <Button
                        variant="contained"
                        size="small"
                        component="label"
                        startIcon={<AttachFileIcon />}
                        sx={{ mt: 1, mb: 1, borderRadius: 2, fontWeight: 500 }}
                      >
                        Adjuntar archivos
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={e => handleArchivosRespuestaChange(e, com.id)}
                        />
                      </Button>
                      {archivosRespuesta[com.id] && archivosRespuesta[com.id].length > 0 && (
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
                          {archivosRespuesta[com.id].map((file, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {file.name}
                              </span>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveArchivoRespuesta(com.id, idx)}
                                sx={{ ml: 1 }}
                              >
                                Eliminar
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {alertaRespuesta[com.id] && (
                        <Box sx={{ mb: 1 }}>
                          <Alert severity="warning">{alertaRespuesta[com.id]}</Alert>
                        </Box>
                      )}
                      <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        sx={{ m: 2, borderRadius: 2, fontWeight: 600 }}
                        disabled={loadingRespuesta}
                        startIcon={loadingRespuesta ? <CircularProgress size={16} /> : null}
                      >
                        {loadingRespuesta ? "Enviando..." : "Enviar"}
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>
            <Box component="form" onSubmit={handleNuevoComentario}>
              <TextField
                size="small"
                fullWidth
                value={nuevoComentario}
                onChange={e => setNuevoComentario(e.target.value)}
                placeholder="Agregar un comentario..."
              />
              <Button
                variant="contained"
                component="label"
                size="small"
                startIcon={<AttachFileIcon />}
                sx={{ mt: 1, mb: 1, borderRadius: 2, fontWeight: 500 }}
              >
                Adjuntar archivos
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleArchivosComentarioChange}
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
                        onClick={() => handleRemoveArchivoComentario(idx)}
                        sx={{ ml: 1 }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
              {alertaComentario && (
                <Box sx={{ mb: 1 }}>
                  <Alert severity="warning">{alertaComentario}</Alert>
                </Box>
              )}
              <Button
                type="submit"
                size="small"
                variant="contained"
                sx={{ m: 2, borderRadius: 2, fontWeight: 600 }}
                disabled={loadingComentario}
                startIcon={loadingComentario ? <CircularProgress size={18} /> : null}
              >
                {loadingComentario ? "Enviando..." : "Comentar"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Modal open={archivoModalOpen} onClose={() => setArchivoModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
          }}
        >
          {archivoSeleccionado && (
            <>
              {/\.(pdf)$/i.test(archivoSeleccionadoKey) ? (
                <iframe
                  src={archivoSeleccionado}
                  title="Archivo PDF"
                  width="800px"
                  height="600px"
                  style={{ border: "none" }}
                />
              ) : (
                <img
                  src={archivoSeleccionado}
                  alt="Archivo adjunto"
                  style={{ maxWidth: "80vw", maxHeight: "80vh" }}
                />
              )}
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button onClick={() => setArchivoModalOpen(false)} variant="contained">
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Detalle;