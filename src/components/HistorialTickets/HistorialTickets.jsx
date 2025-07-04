import {Box, Typography, IconButton} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import TicketsTable from "../Tasks/TicketTable";
import TicketFilters from "../Tasks/TicketFilters";
import { useState } from "react";
import { useSelector } from "react-redux";

const HistorialTickets = ({ isMenuOpen, toggleMenu, tickets, clientes, ...props }) => {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const user = useSelector((state) => state.auth.user);

  let ticketsCerrados = tickets.filter(t => t.Categorium?.nombre === "Cerrado");

  if (user?.user.rol === "cliente") {
    ticketsCerrados = ticketsCerrados.filter(
      t => String(t.Usuario?.id) === String(user.user.id)
    );
  }

  if (user?.user.rol === "admin") {
    ticketsCerrados = ticketsCerrados.filter(
      t => !clienteFiltro || String(t.Cliente?.id) === String(clienteFiltro)
    );
  }

  return (
    <Box sx={{ mt: 4, ml: `calc(${isMenuOpen ? '12rem' : '0px'} + 2rem)`, mr: '2rem', transition: 'margin-left 0.3s' }}>
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
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>Tickets Cerrados</Typography>
      </Box>
      {user?.user.rol === "admin" && (
        <Box sx={{ mb: 2 }}>
          <TicketFilters
            categoria="" setCategoria={() => { }}
            categorias={[]}
            sistemaFiltro="" setSistemaFiltro={() => { }}
            sistemas={[]}
            clienteFiltro={clienteFiltro} setClienteFiltro={setClienteFiltro}
            clientes={clientes}
            fechaInicio="" setFechaInicio={() => { }}
            fechaFin="" setFechaFin={() => { }}
            onFiltrar={() => { }}
            onLimpiar={() => setClienteFiltro("")}
          />
        </Box>
      )}
      <TicketsTable tickets={ticketsCerrados} {...props} />
    </Box>
  );
};

export default HistorialTickets;