import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select,
  InputLabel, FormControl, MenuItem, Box
} from "@mui/material";
import {
  Edit, Delete, PlayForWork, HourglassBottom, Loop, History, Visibility, CheckCircleOutline, Settings, AccountCircle
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

// Estilos comprimidos para la tabla
const SmallTableCell = styled(TableCell)({
  padding: "4px 8px",
  fontSize: "0.85rem",
});
const SmallTableRow = styled(TableRow)({
  height: 32,
});
const SmallChip = styled(Chip)({
  fontSize: "0.75rem",
  height: 22,
  padding: "0 6px",
});

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

const prioridadColor = (prioridad) => {
  switch (prioridad) {
    case "Alta": return "error";
    case "Media": return "warning";
    default: return "success";
  }
};

const TicketsTable = ({
  tickets = [],
  handleOpenModal,
  handleDeleteTicket,
  onTomarTicket,
  onAsignarTicket,
  onCambiarCategoria,
  usuarios = [],
  categorias = [],
  onOpenHorasModal
}) => {
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [usuarioAsignado, setUsuarioAsignado] = useState("");
  const [cambiarCategoriaOpen, setCambiarCategoriaOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmarTomarOpen, setConfirmarTomarOpen] = useState(false);
  const [ticketParaTomar, setTicketParaTomar] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const usuariosFiltrados = usuarios.filter(u => u.rol !== "cliente");

  // Acciones
  const handleTomar = (ticket) => {
    setTicketParaTomar(ticket);
    setConfirmarTomarOpen(true);
  };

  const handleTomarConfirm = () => {
    if (ticketParaTomar) {
      onTomarTicket(ticketParaTomar.id, user?.user?.id);
      setConfirmarTomarOpen(false);
      setTicketParaTomar(null);
    }
  };

  const handleAsignar = (ticket) => {
    setTicketSeleccionado(ticket);
    setAsignarOpen(true);
  };

  const handleAsignarConfirm = () => {
    if (usuarioAsignado && ticketSeleccionado) {
      onAsignarTicket(ticketSeleccionado.id, usuarioAsignado);
      setAsignarOpen(false);
      setUsuarioAsignado("");
      setTicketSeleccionado(null);
    }
  };

  const handleCambiarCategoria = (ticket) => {
    if (
      ticket.Estado?.nombre === "Abierto" &&
      !ticket.tomado &&
      !ticket.usuarioAsignado
    ) {
      setTicketParaTomar(ticket);
      setConfirmarTomarOpen(true);
      return;
    }
    setTicketSeleccionado(ticket);
    setCambiarCategoriaOpen(true);
    setCategoriaSeleccionada(ticket.categoriaId || "");
  };

  const handleCambiarCategoriaConfirm = () => {
    if (categoriaSeleccionada && categoriaSeleccionada !== ticketSeleccionado.categoriaId) {
      onCambiarCategoria(ticketSeleccionado.id, categoriaSeleccionada);
    }
    setCambiarCategoriaOpen(false);
    setTicketSeleccionado(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: "none", mt: 1 }}>
        <Table size="small">
          <TableHead>
            <SmallTableRow sx={{ background: "#f5f5f5" }}>
              <SmallTableCell><b>Id</b></SmallTableCell>
              <SmallTableCell><b>Prioridad</b></SmallTableCell>
              <SmallTableCell><b>Sistemas</b></SmallTableCell>
              <SmallTableCell><b>Título</b></SmallTableCell>
              <SmallTableCell><b>Usuario Cliente</b></SmallTableCell>
              <SmallTableCell><b>Fecha</b></SmallTableCell>
              <SmallTableCell><b>Categoría</b></SmallTableCell>
              <SmallTableCell><b>Estado</b></SmallTableCell>
              { user?.user.rol === "admin" && (
                <SmallTableCell><b>Tomado</b></SmallTableCell>
              )}
              <SmallTableCell><b>Acciones</b></SmallTableCell>
            </SmallTableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <SmallTableRow key={ticket.id}>
                <SmallTableCell>{ticket.id}</SmallTableCell>
                <SmallTableCell>
                  <SmallChip
                    label={ticket.prioridad}
                    color={prioridadColor(ticket.prioridad)}
                  />
                </SmallTableCell>
                <SmallTableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Settings sx={{ fontSize: 16 }} />
                    <span style={{ fontSize: "0.85rem" }}>{ticket.Sistema?.nombre || "-"}</span>
                  </Box>
                </SmallTableCell>
                <SmallTableCell>{ticket.titulo}</SmallTableCell>
                <SmallTableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccountCircle sx={{ fontSize: 16 }} />
                    <span style={{ fontSize: "0.85rem" }}>{ticket.Usuario?.nombre || "-"} {ticket.Usuario?.apellido || ""}</span>
                  </Box>
                </SmallTableCell>
                <SmallTableCell>
                  <span style={{ fontSize: "0.85rem" }}>
                    {new Date(ticket.fechaCreacion).toLocaleString()}
                  </span>
                </SmallTableCell>
                <SmallTableCell>
                  <SmallChip
                    label={ticket.Categorium?.nombre || "-"}
                    color="primary"
                    sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                  />
                </SmallTableCell>
                <SmallTableCell>
                  <SmallChip
                    label={ticket.Estado?.nombre || "-"}
                    sx={getCategoriaChipStyle(ticket.Estado?.nombre)}
                    clickable={user?.user.rol !== "cliente"}
                    onClick={user?.user.rol !== "cliente" ? () => handleCambiarCategoria(ticket) : undefined}
                  />
                </SmallTableCell>
                { user?.user.rol === "admin" && (
                  <SmallTableCell>
                    {ticket.tomado && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CheckCircleOutline sx={{ fontSize: 16 }} />
                        <span style={{ fontSize: "0.85rem" }}>{ticket.usuarioAsignado || "-"}</span>
                      </Box>
                    )}
                  </SmallTableCell>
                )}
                <SmallTableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {user?.user.rol === "admin" && ticket.Estado?.nombre !== "Cerrado"  && (
                      <>
                        {!ticket.tomado && (
                          <IconButton size="small" onClick={() => handleTomar(ticket)} title="Tomar">
                            <PlayForWork sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleAsignar(ticket)} title="Asignar">
                          <Loop sx={{ fontSize: 18 }} />
                        </IconButton>
                      </>
                    )}
                    {ticket.Estado?.nombre === "Abierto" && (
                      <IconButton size="small" onClick={() => handleOpenModal(ticket)}>
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    {(
                      (user?.user.rol === "cliente" && ticket.Estado?.nombre === "Abierto") ||
                      (user?.user.rol !== "cliente")
                    ) && (
                      <IconButton size="small" onClick={() => handleDeleteTicket(ticket.id)}>
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    {user?.user.rol === "admin" && ticket.Estado?.nombre === "Cerrado" && !ticket.horasCargadas && (
                      <IconButton
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => onOpenHorasModal(ticket)}
                      >
                        <HourglassBottom sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/historial/${ticket.id}`)}
                    >
                      <History sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/detalle/${ticket.id}`)}
                    >
                      <Visibility sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </SmallTableCell>
              </SmallTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmarTomarOpen} onClose={() => setConfirmarTomarOpen(false)}>
        <DialogTitle sx={{ fontSize: "1rem" }}>¿Desea tomar el ticket?</DialogTitle>
        <DialogActions>
          <Button
            onClick={handleTomarConfirm}
            variant="contained"
            color="primary"
            sx={{ fontSize: "0.85rem", py: 0.5 }}
          >
            Sí
          </Button>
          <Button
            onClick={() => {
              setConfirmarTomarOpen(false);
              setTicketParaTomar(null);
            }}
            variant="outlined"
            sx={{ fontSize: "0.85rem", py: 0.5 }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={asignarOpen} onClose={() => setAsignarOpen(false)}>
        <DialogTitle sx={{ fontSize: "1rem" }}>Asignar ticket a usuario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ minWidth: 200, margin: "8px 0" }}>
            <InputLabel id="usuario-asignado-label" sx={{ fontSize: "0.85rem" }}>Usuario</InputLabel>
            <Select
              labelId="usuario-asignado-label"
              value={usuarioAsignado}
              label="Usuario"
              onChange={e => setUsuarioAsignado(e.target.value)}
              size="small"
              sx={{ fontSize: "0.85rem" }}
            >
              {usuariosFiltrados.map(u => (
                <MenuItem key={u.id} value={u.id} sx={{ fontSize: "0.85rem" }}>{u.nombre} ({u.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAsignarOpen(false)} sx={{ fontSize: "0.85rem", py: 0.5 }}>Cancelar</Button>
          <Button onClick={handleAsignarConfirm} disabled={!usuarioAsignado} sx={{ fontSize: "0.85rem", py: 0.5 }}>Asignar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cambiarCategoriaOpen} onClose={() => setCambiarCategoriaOpen(false)}>
        <DialogTitle sx={{ fontSize: "1rem" }}>Cambiar estado/categoría</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ minWidth: 200, margin: "8px 0" }}>
            <InputLabel id="categoria-label" sx={{ fontSize: "0.85rem" }}>Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              value={categoriaSeleccionada}
              label="Categoría"
              onChange={e => setCategoriaSeleccionada(e.target.value)}
              size="small"
              sx={{ fontSize: "0.85rem" }}
            >
              {categorias.map(cat => (
                <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: "0.85rem" }}>{cat.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCambiarCategoriaOpen(false)} sx={{ fontSize: "0.85rem", py: 0.5 }}>Cancelar</Button>
          <Button onClick={handleCambiarCategoriaConfirm} disabled={!categoriaSeleccionada || categoriaSeleccionada === (ticketSeleccionado?.categoriaId)} sx={{ fontSize: "0.85rem", py: 0.5 }}>Cambiar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketsTable;