import React, { useEffect, useState } from "react";
import { getSistemas, getResumenHorasMensual } from "../../store/apis/sistemasApi";
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getSistemas({ clienteId: user.id }, token);
        setSistemas(data);

        const resumenesTemp = {};
        for (const sistema of data) {
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
  }, [user, token]);

  const mesesDisponibles = Array.from(
    new Set(
      Object.values(resumenes)
        .flat()
        .map(r => `${r.anio}-${String(r.mes).padStart(2, "0")}`)
    )
  ).sort();

  return (
    <Box sx={{
      mt: 4,
      ml: `calc(${isMenuOpen ? '16rem' : '0px'} + 2rem)`,
      mr: '2rem',
      transition: 'margin-left 0.3s',
    }}>
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
        <Typography variant="h5" sx={{ mb: 2 }}>Horas Consumidas</Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <FormControl sx={{ mb: 2, minWidth: 200 }}>
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
                {sistemas.map(sistema => {
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