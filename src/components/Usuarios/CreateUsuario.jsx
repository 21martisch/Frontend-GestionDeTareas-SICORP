import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Box, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  createUsuario,
  updateUsuario
} from "../../store/apis/usuariosApi"; 

const roles = [
  { value: "admin", label: "Admin" },
  { value: "cliente", label: "Cliente" },
];

const CreateUsuario = ({ usuario, onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "cliente",
  });
  const [showPassword, setShowPassword] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol || "cliente",
      });
    }
  }, [usuario]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (usuario) {
        return updateUsuario(usuario.id, data, token);
      } else {
        return createUsuario(data, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      onClose();
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = { ...form };
    if (usuario) {
      delete data.password;
    }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
        />
        {!usuario && (
          <TextField
            label="Contraseña"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            type={showPassword ? "text" : "password"}
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
              ),
            }}
          />
        )}
        <TextField
          select
          label="Rol"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          required
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {usuario ? "Guardar" : "Crear"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default CreateUsuario;