import React, { useEffect, useState } from "react";
import { getSistemas, getResumenHorasMensual } from "../../store/apis/sistemasApi";
import { getClientes } from "../../store/apis/clientesApi";
import { getCategorias } from "../../store/apis/categoriasApi";
import { useSelector } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box, MenuItem, Select, FormControl, InputLabel, IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from "@mui/material/styles";

// Estilos comprimidos para la tabla
const SmallTableCell = styled(TableCell)({
  padding: "6px 10px",
  fontSize: "0.95rem",
});
const SmallTableRow = styled(TableRow)({
  height: 36,
  "&:hover": {
    background: "#f5f7fa"
  }
});

const HorasContrato = ({ isMenuOpen, toggleMenu }) => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  const [sistemas, setSistemas] = useState([]);
  const [resumenes, setResumenes] = useState({});
  const [loading, setLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    if (user.user.rol === "admin" && clientes.length > 0 && !clienteSeleccionado) {
      setClienteSeleccionado(clientes[0].id);
    }
  }, [user, clientes, clienteSeleccionado]);

  useEffect(() => {
    if (categorias.length > 0 && !categoriaSeleccionada) {
      setCategoriaSeleccionada(categorias[0].nombre);
    }
  }, [categorias, categoriaSeleccionada]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getSistemas({}, token);
        setSistemas(data);

        const categoriasRes = await getCategorias(token);
        setCategorias(categoriasRes.data);

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
    // eslint-disable-next-line
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

  const categoriasFiltradas = categorias.filter(cat => cat.nombre === categoriaSeleccionada);

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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', lg: '1.5rem' } }}>
          Horas Consumidas
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {user.user.rol === "admin" && (
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel sx={{ fontSize: "0.95rem" }}>Cliente</InputLabel>
                <Select
                  value={clienteSeleccionado}
                  label="Cliente"
                  onChange={e => setClienteSeleccionado(e.target.value)}
                  size="small"
                  sx={{ fontSize: "0.95rem" }}
                >
                  {clientes.map(cliente => (
                    <MenuItem key={cliente.id} value={cliente.id} sx={{ fontSize: "0.95rem" }}>{cliente.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: "0.95rem" }}>Mes</InputLabel>
              <Select
                value={mesSeleccionado}
                label="Mes"
                onChange={e => setMesSeleccionado(e.target.value)}
                size="small"
                sx={{ fontSize: "0.95rem" }}
              >
                {mesesDisponibles.map(mes => (
                  <MenuItem key={mes} value={mes} sx={{ fontSize: "0.95rem" }}>
                    {mes.split("-")[1]}/{mes.split("-")[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel sx={{ fontSize: "0.95rem" }}>Tipo de Hora</InputLabel>
              <Select
                value={categoriaSeleccionada}
                label="Tipo de Hora"
                onChange={e => setCategoriaSeleccionada(e.target.value)}
                size="small"
                sx={{ fontSize: "0.95rem" }}
              >
                {categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.nombre} sx={{ fontSize: "0.95rem" }}>{cat.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}>
            <Table size="small">
              <TableHead>
                <SmallTableRow sx={{ background: "#f5f5f5" }}>
                  <SmallTableCell>Sistema</SmallTableCell>
                  {categoriasFiltradas.map(cat => (
                    <SmallTableCell key={cat.id} align="center">Horas Contratadas</SmallTableCell>
                  ))}
                  {categoriasFiltradas.map(cat => (
                    <SmallTableCell key={cat.id + "-consumidas"} align="center">Horas Consumidas</SmallTableCell>
                  ))}
                  {categoriasFiltradas.map(cat => (
                    <SmallTableCell key={cat.id + "-restantes"} align="center">Horas Restantes</SmallTableCell>
                  ))}
                </SmallTableRow>
              </TableHead>
              <TableBody>
                {sistemasFiltrados.map(sistema => {
                  const resumen = (resumenes[sistema.id] || []).find(
                    r => `${r.anio}-${String(r.mes).padStart(2, "0")}` === mesSeleccionado
                  );
                  return (
                    <SmallTableRow key={sistema.id}>
                      <SmallTableCell>{sistema.nombre}</SmallTableCell>
                      {categoriasFiltradas.map(cat => (
                        <SmallTableCell key={cat.id} align="center">
                          {resumen
                            ? (resumen.categorias.find(c => c.categoria === cat.nombre)?.horasContratadas ?? "-")
                            : "-"}
                        </SmallTableCell>
                      ))}
                      {categoriasFiltradas.map(cat => (
                        <SmallTableCell key={cat.id + "-consumidas"} align="center">
                          {resumen
                            ? (resumen.categorias.find(c => c.categoria === cat.nombre)?.horasConsumidas ?? "-")
                            : "-"}
                        </SmallTableCell>
                      ))}
                      {categoriasFiltradas.map(cat => (
                        <SmallTableCell key={cat.id + "-restantes"} align="center">
                          {resumen
                            ? (resumen.categorias.find(c => c.categoria === cat.nombre)?.horasRestantes ?? "-")
                            : "-"}
                        </SmallTableCell>
                      ))}
                    </SmallTableRow>
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