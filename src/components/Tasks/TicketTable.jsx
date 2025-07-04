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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell><b>Id</b></TableCell>
              <TableCell><b>Prioridad</b></TableCell>
              <TableCell><b>Sistemas</b></TableCell>
              <TableCell><b>Título</b></TableCell>
              <TableCell><b>Usuario Cliente</b></TableCell>
              <TableCell><b>Fecha</b></TableCell>
              <TableCell><b>Categoría</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Tomado</b></TableCell>
              <TableCell><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.prioridad}
                    color={prioridadColor(ticket.prioridad)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Settings sx={{ fontSize: 18 }} />
                    {ticket.Sistema?.nombre || "-"}
                  </Box>
                </TableCell>
                <TableCell>{ticket.titulo}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccountCircle sx={{ fontSize: 18 }} />
                    {ticket.Usuario?.nombre || "-"} {ticket.Usuario?.apellido || ""}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(ticket.fechaCreacion).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={ticket.categoriaTipo}
                    color="primary"
                    sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#1976d2" }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.Categorium?.nombre || "-"}
                    sx={getCategoriaChipStyle(ticket.Categorium?.nombre)}
                    size="small"
                    clickable={user?.user.rol !== "cliente"}
                    onClick={user?.user.rol !== "cliente" ? () => handleCambiarCategoria(ticket) : undefined}
                  />
                </TableCell>
                <TableCell>
                  {ticket.tomado && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CheckCircleOutline sx={{ fontSize: 18 }} />
                      {ticket.usuarioAsignado || "-"}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {user?.user.rol === "admin" && ticket.Categorium?.nombre === "Abierto" && !ticket.tomado && (
                      <>
                        <IconButton onClick={() => handleTomar(ticket)}  title="Tomar">
                          <PlayForWork />
                        </IconButton>
                        <IconButton onClick={() => handleAsignar(ticket)}  title="Asignar">
                          <Loop />
                        </IconButton>
                      </>
                    )}
                    {user?.user.rol === "admin" && ticket.Categorium?.nombre === "Abierto" && ticket.tomado && (
                      <IconButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleAsignar(ticket)}
                        title="Asignar"
                      >
                        <Loop />
                      </IconButton>
                    )}
                    
                    {ticket.Categorium?.nombre === "Abierto" && (
                      <IconButton onClick={() => handleOpenModal(ticket)}>
                        <Edit />
                      </IconButton>
                    )}
                    {(
                      (user?.user.rol === "cliente" && ticket.Categorium?.nombre === "Abierto") ||
                      (user?.user.rol !== "cliente")
                    ) && (
                      <IconButton onClick={() => handleDeleteTicket(ticket.id)}>
                        <Delete />
                      </IconButton>
                    )}
                    {user?.user.rol === "admin" && ticket.Categorium?.nombre === "Cerrado" && !ticket.horasCargadas && (
                      <IconButton
                        variant="outlined"
                        color="secondary"
                        onClick={() => onOpenHorasModal(ticket)}
                      >
                        <HourglassBottom />
                      </IconButton>
                    )}
                    <IconButton
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/historial/${ticket.id}`)}
                    >
                      <History />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/detalle/${ticket.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo Confirmar Tomar */}
      <Dialog open={confirmarTomarOpen} onClose={() => setConfirmarTomarOpen(false)}>
        <DialogTitle>¿Desea tomar el ticket?</DialogTitle>
        <DialogActions>
          <Button
            onClick={handleTomarConfirm}
            variant="contained"
            color="primary"
          >
            Sí
          </Button>
          <Button
            onClick={() => {
              setConfirmarTomarOpen(false);
              setTicketParaTomar(null);
            }}
            variant="outlined"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo Asignar */}
      <Dialog open={asignarOpen} onClose={() => setAsignarOpen(false)}>
        <DialogTitle>Asignar ticket a usuario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="usuario-asignado-label">Usuario</InputLabel>
            <Select
              labelId="usuario-asignado-label"
              value={usuarioAsignado}
              label="Usuario"
              onChange={e => setUsuarioAsignado(e.target.value)}
            >
              {usuariosFiltrados.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.nombre} ({u.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAsignarOpen(false)}>Cancelar</Button>
          <Button onClick={handleAsignarConfirm} disabled={!usuarioAsignado}>Asignar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo Cambiar Categoria */}
      <Dialog open={cambiarCategoriaOpen} onClose={() => setCambiarCategoriaOpen(false)}>
        <DialogTitle>Cambiar estado/categoría</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="categoria-label">Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              value={categoriaSeleccionada}
              label="Categoría"
              onChange={e => setCategoriaSeleccionada(e.target.value)}
            >
              {categorias.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCambiarCategoriaOpen(false)}>Cancelar</Button>
          <Button onClick={handleCambiarCategoriaConfirm} disabled={!categoriaSeleccionada || categoriaSeleccionada === (ticketSeleccionado?.categoriaId)}>Cambiar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketsTable;