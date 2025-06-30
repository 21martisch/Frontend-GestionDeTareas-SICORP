import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress, Paper, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Modal } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {Visibility} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import {
  getTicketById,
  getComentarios,
  addComentario
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

const Detalle = (props) => {
  const params = useParams();
  const ticketId = props.ticketId || params.ticketId;
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [responderA, setResponderA] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");
  const [archivoModalOpen, setArchivoModalOpen] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

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

  const handleNuevoComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    try {
      const { data } = await addComentario(ticketId, nuevoComentario, token);
      setComentarios([...comentarios, data]);
      setNuevoComentario("");
    } catch (error) {}
  };

  const handleResponderComentario = async (e) => {
    e.preventDefault();
    if (!textoRespuesta.trim()) return;
    try {
      const { data } = await addComentario(ticketId, textoRespuesta, token, responderA);
      setComentarios(comentarios.map(com =>
        com.id === responderA
          ? { ...com, Respuestas: [...(com.Respuestas || []), data] }
          : com
      ));
      setTextoRespuesta("");
      setResponderA(null);
    } catch (error) {}
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
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">{ticket.titulo}</Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(ticket.fechaCreacion).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
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
              sx={{ fontWeight: 500, mr: 1 }}
            />
            <Chip
              label={ticket.categoriaTipo || "-"}
              size="small"
              color="primary"
              sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#1976d2" }}
            />
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Cliente: <b>{ticket.Cliente?.nombre || "-"}</b>
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Sistema: <b>{ticket.Sistema?.nombre || "-"}</b>
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Categoría:{" "}
            <Chip
              label={ticket.Categorium?.nombre || "-"}
              sx={getCategoriaChipStyle(ticket.Categorium?.nombre)}
              size="small"
            />
          </Typography>
          {ticket.tomado && (
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Usuario asignado: <b>{ticket.Usuario?.nombre || "-"}</b>
            </Typography>
          )}
          {ticket.fechaCierre && (
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Fecha de cierre: <b>{ticket.fechaCierre ? new Date(ticket.fechaCierre).toLocaleDateString() : "-"}</b>
            </Typography>
          )}
          {ticket.descripcion && (
            <Typography variant="subtitle1" sx={{ mb: 2, wordBreak: "break-word" }}>
              Descripción: <b>{ticket.descripcion}</b>
            </Typography>
          )}
          {ticket.archivosAdjuntos && ticket.archivosAdjuntos.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Archivos adjuntos:
              </Typography>
              <List dense>
                {ticket.archivosAdjuntos.map((url, idx) => {
                  const nombre = decodeURIComponent(url.split("/").pop());
                  return (
                    <ListItem key={url} divider>
                      <ListItemText primary={nombre} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => { setArchivoSeleccionado(url); setArchivoModalOpen(true); }}>
                          <Visibility />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Comentarios</Typography>
            <Paper sx={{ maxHeight: 300, overflowY: "auto", p: 2, mb: 2 }}>
              {comentarios.length === 0 && (
                <Typography variant="body2" color="textSecondary">No hay comentarios aún.</Typography>
              )}
              {comentarios.map(com => (
                <Box key={com.id} sx={{ mb: 2, pl: 0 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{com.Usuario?.nombre || "Usuario"}</Typography>
                    <Typography variant="body2">{com.texto}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(com.fecha).toLocaleString()}
                    </Typography>
                    <Button size="small" onClick={() => setResponderA(com.id)}>Responder</Button>
                  </Paper>
                  {com.Respuestas && com.Respuestas.map(resp => (
                    <Box key={resp.id} sx={{ ml: 4, mt: 1 }}>
                      <Paper sx={{ p: 2, background: "#f5f5f5" }}>
                        <Typography variant="subtitle2">{resp.Usuario?.nombre || "Usuario"}</Typography>
                        <Typography variant="body2">{resp.texto}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(resp.fecha).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  {responderA === com.id && (
                    <Box component="form" onSubmit={handleResponderComentario} sx={{ mt: 1, ml: 4 }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={textoRespuesta}
                        onChange={e => setTextoRespuesta(e.target.value)}
                        placeholder="Escribe una respuesta..."
                      />
                      <Button type="submit" size="small" variant="contained" sx={{ mt: 1 }}>Enviar</Button>
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
              <Button type="submit" variant="contained" sx={{ mt: 1 }}>Comentar</Button>
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
              {/\.(pdf)$/i.test(archivoSeleccionado) ? (
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