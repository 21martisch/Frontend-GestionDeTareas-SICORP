import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Typography, Box, CircularProgress, Button, Grid, Pagination, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from "../Sidebar/Sidebar";
import TicketModal from "./TicketModal";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TicketsTable from "./TicketTable";
import NoTicketsMessage from "./NoTasksMessage";
import useAuth from "../../hooks/useAuth";
import TicketFilters from "./TicketFilters";
import HorasModal from "./HorasModal";
import {getTickets,createTicket,updateTicket,deleteTicket,tomarTicket, reasignarTicket,cambiarCategoria,updateHoras} from "../../store/apis/ticketsApi";

const Dashboard = ({ isMenuOpen, toggleMenu, filter, setFilter }) => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [initialTicket, setInitialTicket] = useState(null);
  const queryClient = useQueryClient();
  const {user, token} = useAuth();
  const [categoria, setCategoria] = useState("");
  const [sistemaFiltro, setSistemaFiltro] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    categoria: "",
    sistemaFiltro: "",
    clienteFiltro: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [horasModalOpen, setHorasModalOpen] = useState(false);
  const [ticketHoras, setTicketHoras] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingHoras, setPendingHoras] = useState(null);

  const {
    data: cliente,
    isLoading: loadingCliente,
    error: errorCliente,
  } = useQuery({
    queryKey: ["cliente", user?.user.id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes/by-user/${user.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    enabled: !!user && !!token,
  });

  const {
    data: clientes = [],
    isLoading: loadingClientes,
    error: errorClientes,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: user?.user.rol === "admin" && !!user && !!token,
  });

  const {
    data: sistemas = [],
    isLoading: loadingSistemas,
    error: errorSistemas,
  } = useQuery({
    queryKey: ["sistemas", cliente?.id], 
    queryFn: async () => {
      let url = `${import.meta.env.VITE_API_URL}/sistemas`;
      if (user?.user.rol === "cliente" && cliente) {
        url += `?clienteId=${cliente.id}`;
      }
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!user && !!token && (!!cliente || user?.user.rol !== "cliente"), 
  });

  const {
    data: categorias = [],
    isLoading: loadingCategorias,
    error: errorCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!user && !!token,
  });

  const { data: usuariosData = { users: [] } } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: user?.user.rol === "admin" && !!user && !!token,
  });

  const usuarios = usuariosData.users || [];
  const usuariosAdmins = usuarios.filter(u => u.rol === "admin");

  const fetchTickets = async () => {
    const usuarioAsignadoNombre = `${user.user.nombre} ${user.user.apellido}`;
    let params = { page, limit: 10 };
    if (user?.user.rol === "cliente") params.usuarioId = user.user.id;
    if (activeFilters.categoria) params.categoriaId = activeFilters.categoria;
    if (activeFilters.sistemaFiltro) params.sistemaId = activeFilters.sistemaFiltro;
    if (activeFilters.clienteFiltro) params.clienteId = activeFilters.clienteFiltro;
    if (activeFilters.fechaInicio) params.fechaInicio = activeFilters.fechaInicio;
    if (activeFilters.fechaFin) params.fechaFin = activeFilters.fechaFin;
    if (filter === "assigned") params.usuarioAsignado = usuarioAsignadoNombre;
    const { data } = await getTickets(params, token);
    return data;
  };

  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: [
      "tickets",
      filter,
      page,
      cliente?.id,
      activeFilters.categoria,
      activeFilters.sistemaFiltro,
      activeFilters.clienteFiltro,
      activeFilters.fechaInicio,
      activeFilters.fechaFin,
    ],
    queryFn: fetchTickets,
    enabled: !!user && !!token && (user?.user.rol !== "cliente" || !!cliente),
  });

  const addTicketMutation = useMutation({
    mutationFn: (newTicket) => createTicket(newTicket, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      //handleCloseModal();
      toast.success('Ticket agregado con éxito');
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, formData }) => updateTicket(id, formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      //handleCloseModal();
      toast.success('Ticket actualizado con éxito');
    },
  });
  
  const deleteTicketMutation = useMutation({
    mutationFn: (ticketId) => deleteTicket(ticketId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success('Ticket eliminado con éxito');
      if (ticketsData?.length === 1 && page > 1) setPage(page - 1);
    },
  });

  const tomarTicketMutation = useMutation({
    mutationFn: (ticketId) => tomarTicket(ticketId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("¡Ticket tomado!");
    },
    onError: () => {
      toast.error("No se pudo tomar el ticket");
    }
  });

  const reasignarTicketMutation = useMutation({
    mutationFn: ({ ticketId, usuarioId }) => reasignarTicket(ticketId, usuarioId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("¡Ticket asignado!");
    },
    onError: () => {
      toast.error("No se pudo asignar el ticket");
    }
  });

  const cambiarCategoriaMutation = useMutation({
    mutationFn: ({ ticketId, categoriaId }) =>
      cambiarCategoria(ticketId, categoriaId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("¡Categoría actualizada!");
    },
    onError: () => {
      toast.error("No se pudo cambiar la categoría");
    }
  });

  const updateHorasMutation = useMutation({
    mutationFn: ({ id, horasCargadas, forzar }) => updateHoras(id, horasCargadas, token, forzar),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success('Horas actualizadas');
      setHorasModalOpen(false);
      setTicketHoras(null);
    },
  });


  const handleOpenModal = (ticket = null) => {
    setInitialTicket(ticket);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialTicket(null);
  };

  const handleAddTicket = (formData) => {
    if (user?.user.rol === "cliente" && cliente) {
      formData.append("clienteId", cliente.id);
    }
    return addTicketMutation.mutateAsync(formData);
  };

  const handleDeleteTicket = (ticketId) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el ticket?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTicketMutation.mutate(ticketId);
      }
    });
  };

  const handleLimpiarFiltros = () => {
    setCategoria("");
    setSistemaFiltro("");
    setClienteFiltro("");
    setFechaInicio("");
    setFechaFin("");
    setActiveFilters({
      categoria: "",
      sistemaFiltro: "",
      clienteFiltro: "",
      fechaInicio: "",
      fechaFin: "",
    });
    setPage(1);
  };

  const handleTomarTicket = (ticketId) => {
    tomarTicketMutation.mutate(ticketId);
  };

  const handleAsignarTicket = (ticketId, usuarioId) => {
    reasignarTicketMutation.mutate({ ticketId, usuarioId });
  };

  const handleCambiarCategoria = (ticketId, categoriaId) => {
    cambiarCategoriaMutation.mutate({ ticketId, categoriaId });
  };

  const handleSubmitTicket = (formData) => {
    if (initialTicket && initialTicket.id) {
      return updateTicketMutation.mutateAsync({ id: initialTicket.id, formData });
    } else {
      return handleAddTicket(formData);
    }
  };
  const handleOpenHorasModal = (ticket) => {
    setTicketHoras(ticket);
    setHorasModalOpen(true);
  };

  const handleCloseHorasModal = () => {
    setHorasModalOpen(false);
    setTicketHoras(null);
  };

  const handleGuardarHoras = async (nuevasHoras) => {
    try {
      await updateHorasMutation.mutateAsync({ id: ticketHoras.id, horasCargadas: nuevasHoras });
    } catch (err) {
      if (
        err?.response?.status === 400 &&
        err?.response?.data?.puedeForzar
      ) {
        setPendingHoras(nuevasHoras);
        setShowConfirm(true);
        return false;
      } else {
        throw err;
      }
    }
  };

  const handleConfirmSi = async () => {
    await updateHorasMutation.mutateAsync({ id: ticketHoras.id, horasCargadas: pendingHoras, forzar: true });
    setShowConfirm(false);
    setPendingHoras(null);
    setHorasModalOpen(false);
    setTicketHoras(null);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingHoras(null);
  };

  if (!user || !token) {
    return <Typography color="error">No se encontró el token de autenticación. Por favor, inicie sesión.</Typography>;
  }

  if (isLoading || loadingSistemas || loadingCategorias) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || errorSistemas || errorCategorias) {
    return <Typography color="error">Error: {error?.message || errorSistemas?.message || errorCategorias?.message}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {!isMenuOpen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>
          Panel de Tickets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          startIcon={<AddIcon />}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Agregar ticket
        </Button>
        <IconButton
          color="primary"
          aria-label="add ticket"
          onClick={() => handleOpenModal()}
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={10}>
          <TicketFilters
            categoria={categoria} setCategoria={setCategoria}
            categorias={categorias}
            sistemaFiltro={sistemaFiltro} setSistemaFiltro={setSistemaFiltro}
            clienteFiltro={clienteFiltro} setClienteFiltro={setClienteFiltro}
            fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
            fechaFin={fechaFin} setFechaFin={setFechaFin}
            sistemas={sistemas}
            clientes={user?.user.rol === "admin" ? clientes : []}
            onFiltrar={() => {
              setActiveFilters({
                categoria,
                sistemaFiltro,
                clienteFiltro,
                fechaInicio,
                fechaFin,
              });
              setPage(1);
            }}
            onLimpiar={handleLimpiarFiltros}
          />
        </Grid>
      </Grid>
      <TicketModal
        open={openModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitTicket}
        initialTicket={initialTicket}
        sistemas={sistemas}
        clientes={user?.user.rol === "admin" ? clientes : []}
        categorias={categorias}
      />

      {(!ticketsData || ticketsData.length === 0) ? (
        <NoTicketsMessage filter={filter} />
      ) : (
        <>
          <TicketsTable
            tickets={ticketsData.tickets.filter(t => t.Categorium?.nombre !== "Cerrado" || t.horasCargadas === 0)}
            handleOpenModal={handleOpenModal}
            handleDeleteTicket={handleDeleteTicket}
            onTomarTicket={handleTomarTicket}
            onAsignarTicket={handleAsignarTicket}
            onCambiarCategoria={handleCambiarCategoria}
            usuarios={usuarios}
            categorias={categorias}
            onOpenHorasModal={handleOpenHorasModal}
          />

          <Pagination
            count={Math.ceil((ticketsData.total) / 10)}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
          />
          <HorasModal
            open={horasModalOpen}
            handleClose={handleCloseHorasModal}
            handleSubmit={handleGuardarHoras}
            initialHoras={ticketHoras?.horasCargadas}
          />
          <Dialog open={showConfirm} onClose={handleConfirmNo}>
            <DialogTitle>Advertencia</DialogTitle>
            <DialogContent>
              ¿Desea seguir consumiendo horas? Las horas restantes pueden quedar en negativo.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmNo}>No</Button>
              <Button onClick={handleConfirmSi} color="primary" variant="contained">Sí</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Dashboard;