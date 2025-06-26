import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { changeClientePassword } from "../../store/apis/clientesApi";

const ChangePasswordModal = ({ open, onClose, clienteId }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await changeClientePassword(clienteId, password, token);
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cambiar contraseña</DialogTitle>
      <form onSubmit={handleChangePassword}>
        <DialogContent>
          <TextField
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, fontSize: 14 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !password}>
            {loading ? <CircularProgress size={22} /> : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal;