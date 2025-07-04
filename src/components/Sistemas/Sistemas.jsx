import React, { useState } from "react";
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import CreateSistemas from "./CreateSistemas";
import {
  getSistemas,
  deleteSistema
} from "../../store/apis/sistemasApi";

const Sistemas = ({ isMenuOpen, toggleMenu, filter, setFilter }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingSistema, setEditingSistema] = useState(null);
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const { data: sistemas = [], isLoading } = useQuery({
    queryKey: ["sistemas"],
    queryFn: () => getSistemas({}, token).then(res => res.data),
  });

  const deleteSistemaMutation = useMutation({
    mutationFn: (id) => deleteSistema(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["sistemas"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este sistema?")) {
      deleteSistemaMutation.mutate(id);
    }
  };

  const handleEdit = (sistema) => {
    setEditingSistema(sistema);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditingSistema(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSistema(null);
  };

  return (
    <Box >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>Sistemas</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Agregar Sistema
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Horas Soporte</TableCell>
              <TableCell>Horas Desarrollo</TableCell>
              <TableCell>Horas Modificación</TableCell>
              <TableCell>Fecha Desde</TableCell>
              <TableCell>Fecha Hasta</TableCell>
              <TableCell>Clientes Asociados</TableCell>
              <TableCell>Usuarios Asignados</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando...</TableCell>
              </TableRow>
            ) : (
              sistemas.map((sistema) => (
                <TableRow key={sistema.id}>
                  <TableCell>{sistema.nombre}</TableCell>
                  <TableCell>{sistema.horasSoporte ?? "-"}</TableCell>
                  <TableCell>{sistema.horasDesarrollo ?? "-"}</TableCell>
                  <TableCell>{sistema.horasModificacion ?? "-"}</TableCell>
                  <TableCell>
                    {sistema.fechaDesde
                      ? sistema.fechaDesde.split("-").reverse().join("/")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {sistema.fechaHasta
                      ? sistema.fechaHasta.split("-").reverse().join("/")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {sistema.Cliente ? sistema.Cliente.nombre : "-"}
                  </TableCell>
                  <TableCell>
                    {sistema.usuarios && sistema.usuarios.length > 0
                      ? sistema.usuarios.map(u => u.nombre).join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(sistema)} title="Editar">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(sistema.id)} title="Eliminar">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSistema ? "Editar Sistema" : "Agregar Sistema"}</DialogTitle>
        <DialogContent>
          <CreateSistemas
            sistema={editingSistema}
            onClose={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Sistemas;