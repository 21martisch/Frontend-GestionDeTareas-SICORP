import { Box, Typography, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import TicketsTable from "../Tasks/TicketTable";
import TicketFilters from "../Tasks/TicketFilters";
import { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";

const HistorialTickets = ({
    isMenuOpen,
    toggleMenu,
    tickets,
    total,
    clientes,
    sistemas,
    page,
    setPage,
    ...props
}) => {
    const [clienteFiltro, setClienteFiltro] = useState("");
    const [sistemaFiltro, setSistemaFiltro] = useState("");
    const user = useSelector((state) => state.auth.user);

    let ticketsFiltrados = tickets.filter(
    t => t.Estado?.nombre === "Cerrado" && t.horasCargadas > 0
    );

    if (user?.user.rol === "admin") {
        ticketsFiltrados = ticketsFiltrados.filter(
            t => (!clienteFiltro || String(t.Cliente?.id) === String(clienteFiltro)) &&
                 (!sistemaFiltro || String(t.Sistema?.id) === String(sistemaFiltro))
        );
    }

    if (user?.user.rol === "cliente") {
        ticketsFiltrados = ticketsFiltrados.filter(
            t => String(t.Usuario?.id) === String(user.user.id)
        );
    }

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
                    Tickets Cerrados
                </Typography>
            </Box>
            {user?.user.rol === "admin" && (
                <Box sx={{ mb: 2 }}>
                    <TicketFilters
                        soloClienteSistema
                        sinBotones
                        sistemaFiltro={sistemaFiltro} setSistemaFiltro={setSistemaFiltro}
                        sistemas={sistemas}
                        clienteFiltro={clienteFiltro} setClienteFiltro={setClienteFiltro}
                        clientes={clientes}
                    />
                </Box>
            )}
            <TicketsTable tickets={ticketsFiltrados} {...props} />
            <Pagination
                count={Math.ceil(total / 10)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            />
        </Box>
    );
};

export default HistorialTickets;