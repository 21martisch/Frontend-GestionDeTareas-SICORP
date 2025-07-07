import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Divider } from "@mui/material";
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
            PaperProps={{ sx: { minWidth: 280 } }}
          >
            {(Array.isArray(notificaciones) && notificaciones.length === 0) && (
              <MenuItem disabled>No hay notificaciones</MenuItem>
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
                sx={{ cursor: "pointer" }}
              >
                {n.tipo === "nuevo_ticket" && "Nuevo Ticket creado"}
                {n.tipo === "cambio_estado" && "El estado del ticket cambió"}
                {n.tipo === "nuevo_comentario" && (
                  n.Comentario
                    ? n.Comentario.texto.slice(0, 40) + (n.Comentario.texto.length > 40 ? "..." : "")
                    : "Nuevo comentario"
                )}
                <br />
                <Typography variant="caption" color="text.secondary" sx={{ml: 2}}>
                  Ticket Id {n.Ticket?.id}: {n.Ticket?.titulo || "-"}
                </Typography>
              </MenuItem>
            ))}
            {(Array.isArray(notificaciones) && notificaciones.length > 0) && (
              <MenuItem
                onClick={async () => {
                  await marcarNotificacionesLeidas(token);
                  setNotificaciones([]);
                  setAnchorEl(null);
                }}
                sx={{ color: "#1976d2", fontWeight: 700 }}
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