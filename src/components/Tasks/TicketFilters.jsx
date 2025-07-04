import { Box, TextField, MenuItem, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";

const TicketFilters = ({
  categoria, setCategoria,
  sistemaFiltro, setSistemaFiltro,
  clienteFiltro, setClienteFiltro,
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  sistemas = [], clientes = [],
  onFiltrar,
  categorias = [],
  onLimpiar
}) => {
  const user = useSelector(state => state.auth.user);
  const hayFiltros =
    categoria ||
    sistemaFiltro ||
    clienteFiltro ||
    fechaInicio ||
    fechaFin;

  // Si solo hay clientes, muestra solo el filtro de cliente
  const soloFiltroCliente = (!categorias.length && !sistemas.length);

  return (
    <Grid container spacing={2}>
      {soloFiltroCliente ? (
        <>
          {clientes.length > 0 && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField select label="Cliente" value={clienteFiltro} onChange={e => setClienteFiltro(e.target.value)} fullWidth>
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {clienteFiltro && (
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="text" color="secondary" onClick={onLimpiar} fullWidth>Limpiar</Button>
            </Grid>
          )}
        </>
      ) : (
        <>
          <Grid item xs={12} sm={6} md={2}>
            <TextField select label="Estado" value={categoria} onChange={e => setCategoria(e.target.value)} fullWidth>
              <MenuItem value="">Todas</MenuItem>
              {categorias.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField select label="Sistema" value={sistemaFiltro} onChange={e => setSistemaFiltro(e.target.value)} fullWidth>
              <MenuItem value="">Todos</MenuItem>
              {sistemas
                .filter(s =>
                  user.user.rol === "admin" ||
                  (
                    Array.isArray(s.usuarios) &&
                    s.usuarios.some(u => String(u.id) === String(user.user.id))
                  )
                )
                .map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
                ))
              }
            </TextField>
          </Grid>
          {clientes.length > 0 && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField select label="Cliente" value={clienteFiltro} onChange={e => setClienteFiltro(e.target.value)} fullWidth>
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={2}>
            <TextField type="date" label="Fecha inicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField type="date" label="Fecha fin" value={fechaFin} onChange={e => setFechaFin(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button variant="outlined" onClick={onFiltrar} fullWidth>Filtrar</Button>
          </Grid>
          {hayFiltros && (
            <Grid item xs={12} sm={6} md={1}>
              <Button variant="text" color="secondary" onClick={onLimpiar} fullWidth>Limpiar</Button>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default TicketFilters;