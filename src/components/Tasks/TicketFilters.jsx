import { Box, TextField, MenuItem, Button, Grid } from "@mui/material";

const TicketFilters = ({
  categoria, setCategoria,
  sistemaFiltro, setSistemaFiltro,
  clienteFiltro, setClienteFiltro,
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  sistemas, clientes,
  onFiltrar,
  categorias,
  onLimpiar
}) => {
  const hayFiltros =
    categoria ||
    sistemaFiltro ||
    clienteFiltro ||
    fechaInicio ||
    fechaFin;

   return (
    <Grid container spacing={2}>
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
          {sistemas.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
          ))}
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
    </Grid>
  );
};

export default TicketFilters;