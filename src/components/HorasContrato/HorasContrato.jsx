import React, { useEffect, useState } from "react";
import { getSistemas, getResumenHorasMensual } from "../../store/apis/sistemasApi";
import { getClientes } from "../../store/apis/clientesApi";
import { useSelector } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box, MenuItem, Select, FormControl, InputLabel, IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const HorasContrato = ({ isMenuOpen, toggleMenu }) => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  const [sistemas, setSistemas] = useState([]);
  const [resumenes, setResumenes] = useState({});
  const [loading, setLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  useEffect(() => {
    if (user.user.rol === "admin" && clientes.length > 0 && !clienteSeleccionado) {
      setClienteSeleccionado(clientes[0].id);
    }
  }, [user, clientes, clienteSeleccionado]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getSistemas({}, token);
        setSistemas(data);
        const resumenesTemp = {};

        let sistemasFiltrados = data;
        if (user.user.rol === "admin" && clienteSeleccionado) {
          sistemasFiltrados = data.filter(s => String(s.clienteId) === String(clienteSeleccionado));
        } else if (user.user.rol !== "admin") {
          const clienteId = user.user.clienteId;
          sistemasFiltrados = data.filter(
            s =>
              String(s.clienteId) === String(clienteId) &&
              Array.isArray(s.usuarios) &&
              s.usuarios.some(u => String(u.id) === String(user.user.id))
          );
        }

        for (const sistema of sistemasFiltrados) {
          const resumen = await getResumenHorasMensual(sistema.id, token);
          resumenesTemp[sistema.id] = resumen.data;
        }
        setResumenes(resumenesTemp);

        const now = new Date();
        setMesSeleccionado(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
      } catch (err) {}
      setLoading(false);
    };
    fetchData();
  }, [user, token, clienteSeleccionado, clientes]);

  useEffect(() => {
    if (user.user.rol === "admin") {
      getClientes(token).then(({ data }) => setClientes(data));
    }
  }, [user, token]);

  let sistemasFiltrados = sistemas;
  if (user.user.rol === "admin") {
    if (clienteSeleccionado) {
      sistemasFiltrados = sistemas.filter(s => String(s.clienteId) === String(clienteSeleccionado));
    }
  } else {
    const clienteId = user.user.clienteId;
    sistemasFiltrados = sistemas.filter(
      s =>
        String(s.clienteId) === String(clienteId) &&
        Array.isArray(s.usuarios) &&
        s.usuarios.some(u => String(u.id) === String(user.user.id))
    );
  }

  const mesesDisponibles = Array.from(
    new Set(
      Object.values(resumenes)
        .flat()
        .map(r => `${r.anio}-${String(r.mes).padStart(2, "0")}`)
    )
  ).sort();

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {!isMenuOpen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>Horas Consumidas</Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {user.user.rol === "admin" && (
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={clienteSeleccionado}
                  label="Cliente"
                  onChange={e => setClienteSeleccionado(e.target.value)}
                >
                  {clientes.map(cliente => (
                    <MenuItem key={cliente.id} value={cliente.id}>{cliente.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Mes</InputLabel>
              <Select
                value={mesSeleccionado}
                label="Mes"
                onChange={e => setMesSeleccionado(e.target.value)}
              >
                {mesesDisponibles.map(mes => (
                  <MenuItem key={mes} value={mes}>
                    {mes.split("-")[1]}/{mes.split("-")[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sistema</TableCell>
                  <TableCell>Horas Contrato</TableCell>
                  <TableCell>Horas Consumidas</TableCell>
                  <TableCell>Horas Restantes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sistemasFiltrados.map(sistema => {
                  const resumen = (resumenes[sistema.id] || []).find(
                    r => `${r.anio}-${String(r.mes).padStart(2, "0")}` === mesSeleccionado
                  );
                  return (
                    <TableRow key={sistema.id}>
                      <TableCell>{sistema.nombre}</TableCell>
                      <TableCell>{resumen ? resumen.horasContrato : "-"}</TableCell>
                      <TableCell>{resumen ? resumen.horasConsumidas : "-"}</TableCell>
                      <TableCell>{resumen ? resumen.horasRestantes : "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default HorasContrato;