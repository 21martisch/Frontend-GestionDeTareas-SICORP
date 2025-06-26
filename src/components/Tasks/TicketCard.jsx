import React, { useState } from "react";
import {
  Card, Typography, IconButton, Chip, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, InputLabel, FormControl, Box
} from "@mui/material";
import { Edit, Delete, PlayForWork, HourglassBottom, Loop, History, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {AccountCircle, Settings} from '@mui/icons-material';

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

const TicketCard = ({
  ticket,
  handleOpenModal,
  handleDeleteTicket,
  onTomarTicket,
  onAsignarTicket,
  onCambiarCategoria,
  usuarios = [],
  categorias = [],
  onOpenHorasModal,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [usuarioAsignado, setUsuarioAsignado] = useState("");
  const [cambiarCategoriaOpen, setCambiarCategoriaOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleTomar = () => {
    onTomarTicket(ticket.id);
    handleMenuClose();
  };

  const handleAsignar = () => {
    setAsignarOpen(true);
    handleMenuClose();
  };

  const handleAsignarConfirm = () => {
    if (usuarioAsignado) {
      onAsignarTicket(ticket.id, usuarioAsignado);
      setAsignarOpen(false);
      setUsuarioAsignado("");
    }
  };

  const handleCambiarCategoria = () => {
    setCambiarCategoriaOpen(true);
    setCategoriaSeleccionada(ticket.categoriaId || "");
  };

  const handleCambiarCategoriaConfirm = () => {
    if (categoriaSeleccionada && categoriaSeleccionada !== ticket.categoriaId) {
      onCambiarCategoria(ticket.id, categoriaSeleccionada);
    }
    setCambiarCategoriaOpen(false);
  };

  const usuariosFiltrados = usuarios.filter(u => u.rol !== "cliente");

  return (
    <Card sx={{ height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2, maxWidth: 450,width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" noWrap>{ticket.titulo}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(ticket.fechaCreacion).toLocaleDateString()}
        </Typography>
      </Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          <AccountCircle/> {ticket.Cliente?.nombre || "-"}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <Settings sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          {ticket.Sistema?.nombre || "-"}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        {user?.user.rol === "cliente" ? (
          <Chip
            label={ticket.Categorium?.nombre || "-"}
            sx={getCategoriaChipStyle(ticket.Categorium?.nombre)}
          />
        ) : (
          <Chip
            label={ticket.Categorium?.nombre || "-"}
            sx={getCategoriaChipStyle(ticket.Categorium?.nombre)}
            clickable
            onClick={handleCambiarCategoria}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 'auto' }}>
        {ticket.Categorium.nombre !== "Cerrado" && (
          <IconButton onClick={() => handleOpenModal(ticket)}>
            <Edit />
          </IconButton>
        )}
        <IconButton onClick={() => handleDeleteTicket(ticket.id)}>
          <Delete />
        </IconButton>
        {user?.user.rol !== "cliente" && (
          <>
            {ticket.Categorium.nombre === "Abierto"  && !ticket.tomado  && (
              <>
                <IconButton onClick={handleMenuClick}>
                  <PlayForWork />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleTomar}>Tomar</MenuItem>
                  <MenuItem onClick={handleAsignar}>Asignar</MenuItem>
                </Menu>
              </>
            )}
            {ticket.Categorium.nombre === "Cerrado" && (
              <IconButton
                variant="outlined"
                color="secondary"
                onClick={() => onOpenHorasModal(ticket)}
              >
                <HourglassBottom />
              </IconButton>
            )}
            {ticket.Categorium.nombre === "Abierto" && ticket.tomado && (
                <IconButton
                  variant="outlined"
                  size="small"
                  onClick={() => setAsignarOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <Loop />
                </IconButton>
            )}
            {ticket.usuarioId &&
              ticket.Categorium.nombre !== "Cerrado" &&
              ticket.Categorium.nombre !== "Abierto" && (
                <IconButton
                  variant="outlined"
                  size="small"
                  onClick={() => setAsignarOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <Loop />
                </IconButton>
            )}
          </>
        )}
        <IconButton
          variant="outlined"
          size="small"
          onClick={() => navigate(`/historial/${ticket.id}`)}
          sx={{ ml: 1 }}
        >
          <History />
        </IconButton>
        <IconButton
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
          onClick={() => navigate(`/detalle/${ticket.id}`)}
        >
          <Visibility />
        </IconButton>
      </Box>
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
          <Button onClick={handleCambiarCategoriaConfirm} disabled={!categoriaSeleccionada || categoriaSeleccionada === ticket.categoriaId}>Cambiar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TicketCard;