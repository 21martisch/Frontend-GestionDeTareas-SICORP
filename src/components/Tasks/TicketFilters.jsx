import { Box, TextField, MenuItem, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";

const TicketFilters = ({
  soloClienteSistema = false,
  sinBotones = false,
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

  const soloFiltroCliente = (!categorias.length && !sistemas.length);

  const inputProps = { sx: { fontSize: "0.85rem", padding: "6px 8px" } };
  const labelProps = { sx: { fontSize: "0.85rem" } };
  const buttonProps = { size: "small", sx: { fontSize: "0.8rem", py: 0.5 } };

  if (soloClienteSistema) {
    const clientesArray = Array.isArray(clientes) ? clientes : [];
    return (
      <Grid
        container
        spacing={1}
        sx={{
          mb: 1,
          flexWrap: "nowrap",
          alignItems: "center",
          overflowX: "auto"
        }}
      >
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <TextField
            select
            label="Sistema"
            value={sistemaFiltro}
            onChange={e => setSistemaFiltro(e.target.value)}
            fullWidth
            InputProps={inputProps}
            InputLabelProps={labelProps}
            size="small"
          >
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
                <MenuItem key={s.id} value={s.id} sx={{ fontSize: "0.85rem" }}>{s.nombre}</MenuItem>
              ))
            }
          </TextField>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <TextField
            select
            label="Cliente"
            value={clienteFiltro}
            onChange={e => setClienteFiltro(e.target.value)}
            fullWidth
            InputProps={inputProps}
            InputLabelProps={labelProps}
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {clientesArray.map(c => (
              <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.85rem" }}>{c.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        {!sinBotones && (
          <>
            <Grid item xs="auto">
              <Button
                variant="contained"
                color="primary"
                onClick={onFiltrar}
                sx={{
                  minWidth: 80,
                  height: 36,
                  px: 2,
                  fontSize: "0.85rem",
                  bgcolor: "#1976d2",
                  color: "#fff",
                  boxShadow: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  "&:hover": { bgcolor: "#1565c0" }
                }}
                {...buttonProps}
              >
                Filtrar
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="text"
                color="primary"
                onClick={onLimpiar}
                sx={{
                  minWidth: 70,
                  height: 36,
                  px: 1,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: "#1976d2"
                }}
                {...buttonProps}
              >
                Limpiar
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={1}
      sx={{
        mb: 1,
        flexWrap: "nowrap",
        alignItems: "center",
        overflowX: "auto"
      }}
    >
      {soloFiltroCliente ? (
        <>
          {clientes.length > 0 && (
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <TextField
                select
                label="Cliente"
                value={clienteFiltro}
                onChange={e => setClienteFiltro(e.target.value)}
                fullWidth
                size="small"
                InputProps={inputProps}
                InputLabelProps={labelProps}
              >
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.85rem" }}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {clienteFiltro && (
            <Grid item xs="auto">
              <Button
                variant="text"
                color="primary"
                onClick={onLimpiar}
                sx={{
                  minWidth: 70,
                  height: 36,
                  px: 1,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: "#1976d2"
                }}
                {...buttonProps}
              >
                Limpiar
              </Button>
            </Grid>
          )}
        </>
      ) : (
        <>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <TextField
              select
              label="Estado"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              fullWidth
              size="small"
              InputProps={inputProps}
              InputLabelProps={labelProps}
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map(c => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.85rem" }}>{c.nombre}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <TextField
              select
              label="Sistema"
              value={sistemaFiltro}
              onChange={e => setSistemaFiltro(e.target.value)}
              fullWidth
              size="small"
              InputProps={inputProps}
              InputLabelProps={labelProps}
            >
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
                  <MenuItem key={s.id} value={s.id} sx={{ fontSize: "0.85rem" }}>{s.nombre}</MenuItem>
                ))
              }
            </TextField>
          </Grid>
          {clientes.length > 0 && (
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <TextField
                select
                label="Cliente"
                value={clienteFiltro}
                onChange={e => setClienteFiltro(e.target.value)}
                fullWidth
                size="small"
                InputProps={inputProps}
                InputLabelProps={labelProps}
              >
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id} sx={{ fontSize: "0.85rem" }}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <TextField
              type="date"
              label="Fecha inicio"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true, ...labelProps }}
              fullWidth
              size="small"
              InputProps={inputProps}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <TextField
              type="date"
              label="Fecha fin"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true, ...labelProps }}
              fullWidth
              size="small"
              InputProps={inputProps}
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              color="primary"
              onClick={onFiltrar}
              sx={{
                minWidth: 80,
                height: 36,
                px: 2,
                fontSize: "0.85rem",
                bgcolor: "#1976d2",
                color: "#fff",
                boxShadow: "none",
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 0.5,
                "&:hover": { bgcolor: "#1565c0" }
              }}
              {...buttonProps}
            >
              Filtrar
            </Button>
          </Grid>
          {hayFiltros && (
            <Grid item xs="auto">
              <Button
                variant="text"
                color="primary"
                onClick={onLimpiar}
                sx={{
                  minWidth: 70,
                  height: 36,
                  px: 1,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: "#1976d2"
                }}
                {...buttonProps}
              >
                Limpiar
              </Button>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default TicketFilters;