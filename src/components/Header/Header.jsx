import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <AppBar
      position="static"
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