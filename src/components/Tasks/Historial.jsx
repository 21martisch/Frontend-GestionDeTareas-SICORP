import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from "@mui/lab";
import { Paper, Typography, CircularProgress, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getHistorial } from "../../store/apis/ticketsApi";

const actionLabels = {
  crear: "Creación del ticket",
  tomar: "Ticket tomado",
  reasignar: "Ticket reasignado",
  cerrar: "Ticket cerrado",
  cambiar_estado: "Cambio de estado",
};

const Historial = (props) => {
  const params = useParams();
  const ticketId = props.ticketId || params.ticketId;
  const { token } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const { data } = await getHistorial(ticketId, token);
        setHistorial(data);
      } catch (error) {
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) fetchHistorial();
  }, [ticketId, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!historial.length) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No hay historial para este ticket.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Volver
      </Button>
      <Typography variant="h5" gutterBottom>
        Historial del Ticket
      </Typography>
      <Timeline position="alternate">
        {historial.map((item, idx) => (
          <TimelineItem key={item.id || idx}>
            <TimelineOppositeContent color="text.secondary">
              {new Date(item.fecha).toLocaleDateString()}{" "}
              {new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={item.accion === "crear" ? "primary" : "grey"} />
              {idx < historial.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  {actionLabels[item.accion] || item.accion}
                </Typography>
                <Typography variant="body2">
                  {item.Usuario?.nombre || item.Usuario?.email || "Usuario desconocido"}
                </Typography>
                {item.UsuarioAsignado && item.accion === "reasignar"  && (
                  <Typography variant="body2" color="text.secondary">
                    Asignado a: {item.UsuarioAsignado.nombre || item.UsuarioAsignado.email}
                  </Typography>
                )}
                {item.accion === "cambiar_estado" && item.estadoNuevo && (
                    <Typography variant="body2" color="text.secondary">
                        <b>{item.estadoNuevo}</b>
                    </Typography>
                )}
                {item.observacion && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.observacion}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default Historial;