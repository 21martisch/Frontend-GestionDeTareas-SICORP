import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Divider, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { logout } from "../../store/slices/authSlice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getNotificaciones, marcarNotificacionesLeidas, marcarNotificacionLeida } from "../../store/apis/notificacionesApi";

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A8E6CF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  const fetchNotificaciones = async () => {
    try {
      const { data } = await getNotificaciones(token);
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (e) {
      setNotificaciones([]);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  const notificationTypeLabel = (n) => {
    switch (n.tipo) {
      case "nuevo_ticket": return "Nuevo Ticket";
      case "cambio_estado": return "Cambio de Estado";
      case "nuevo_comentario": return "Comentario";
      default: return "Notificación";
    }
  };

  const notificationInfo = (n) => {
    if (n.tipo === "nuevo_comentario") {
      if (n.Comentario?.archivosAdjuntos?.length) return "Comentario con archivo adjunto";
      return n.Comentario
        ? n.Comentario.texto.slice(0, 40) + (n.Comentario.texto.length > 40 ? "..." : "")
        : "Nuevo comentario";
    }
    if (n.tipo === "nuevo_ticket") return "Nuevo Ticket creado";
    if (n.tipo === "cambio_estado") return "El estado del ticket cambió";
    return "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "#e0e0e0",
        color: "#222", 
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)"
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#2e5d6b', letterSpacing: 1.5 }}>SICORP</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            title="Notificaciones"
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <Badge badgeContent={Array.isArray(notificaciones) ? notificaciones.length : 0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                minWidth: 260,
                maxHeight: 280,
                p: 0.5,
                bgcolor: "#fafbfc",
                overflowY: "auto"
              }
            }}
          >
            {(Array.isArray(notificaciones) && notificaciones.length === 0) && (
              <MenuItem disabled sx={{ fontSize: "0.85rem", color: "#888", py: 1 }}>No hay notificaciones</MenuItem>
            )}
            {(Array.isArray(notificaciones) ? notificaciones : []).map(n => (
              <MenuItem
                key={n.id}
                onClick={async () => {
                  await marcarNotificacionLeida(n.id, token);
                  setNotificaciones(notificaciones.filter(notif => notif.id !== n.id));
                  setAnchorEl(null);
                  navigate(`/detalle/${n.Ticket?.id}`);
                }}
                sx={{
                  cursor: "pointer",
                  alignItems: "flex-start",
                  py: 0.5,
                  fontSize: "0.85rem",
                  whiteSpace: "normal",
                  borderBottom: "1px solid #f0f0f0",
                  "&:last-child": { borderBottom: "none" }
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1976d2", fontSize: "0.9rem" }}>
                    {notificationTypeLabel(n)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#222", fontSize: "0.85rem", fontWeight: 400 }}>
                    Ticket #{n.Ticket?.id}: {n.Ticket?.titulo || "-"}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            {(Array.isArray(notificaciones) && notificaciones.length > 0) && (
              <MenuItem
                onClick={async () => {
                  await marcarNotificacionesLeidas(token);
                  setNotificaciones([]);
                  setAnchorEl(null);
                }}
                sx={{
                  color: "#1976d2",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  justifyContent: "center",
                  py: 1,
                  borderBottom: "none"
                }}
              >
                Marcar todas como leídas
              </MenuItem>
            )}
          </Menu>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {user?.user?.nombre} {user?.user?.apellido}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: "#bbb" }} />
          <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;