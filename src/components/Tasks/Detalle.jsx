import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress, Paper, Button, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
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
            Usuario: <b>{ticket.Usuario?.nombre || "-"}</b>
          </Typography>
        )}
        {ticket.fechaCierre && (
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Fecha de cierre: <b>{ticket.fechaCierre ? new Date(ticket.fechaCierre).toLocaleDateString() : "-"}</b>
          </Typography>
        )}
        {ticket.descripcion && (
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Descripción: <b>{ticket.descripcion}</b>
          </Typography>
        )}
        {ticket.archivoAdjunto && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href={ticket.archivoAdjunto}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 1 }}
            >
              Ver archivo
            </Button>
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
  );
};

export default Detalle;