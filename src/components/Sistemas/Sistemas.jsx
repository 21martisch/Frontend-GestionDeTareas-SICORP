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
import { getCategorias } from "../../store/apis/categoriasApi";
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

const Sistemas = ({ isMenuOpen, toggleMenu, filter, setFilter }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingSistema, setEditingSistema] = useState(null);
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const { data: sistemas = [], isLoading } = useQuery({
    queryKey: ["sistemas"],
    queryFn: () => getSistemas({}, token).then(res => res.data),
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategorias(token).then(res => res.data),
    enabled: !!token,
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
    <Box>
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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', lg: '1.5rem' } }}>
          Sistemas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add sx={{ fontSize: 20 }} />}
          onClick={handleAdd}
          sx={{
            fontSize: "0.95rem",
            py: 0.5,
            px: 2,
            boxShadow: "none",
            borderRadius: 2
          }}
        >
          Agregar Sistema
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}>
        <Table size="small">
          <TableHead>
            <SmallTableRow sx={{ background: "#f5f5f5" }}>
              <SmallTableCell><b>Nombre</b></SmallTableCell>
              {categorias.map(cat => (
                <SmallTableCell key={cat.id}><b>{cat.nombre}</b></SmallTableCell>
              ))}
              <SmallTableCell><b>Fecha Desde</b></SmallTableCell>
              <SmallTableCell><b>Fecha Hasta</b></SmallTableCell>
              <SmallTableCell><b>Clientes Asociados</b></SmallTableCell>
              <SmallTableCell><b>Usuarios Asignados</b></SmallTableCell>
              <SmallTableCell align="center"><b>Acciones</b></SmallTableCell>
            </SmallTableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <SmallTableRow>
                <SmallTableCell colSpan={7 + categorias.length} align="center">Cargando...</SmallTableCell>
              </SmallTableRow>
            ) : (
              sistemas.map((sistema) => (
                <SmallTableRow key={sistema.id}>
                  <SmallTableCell>{sistema.nombre}</SmallTableCell>
                  {categorias.map(cat => {
                    const catSistema = sistema.Categoria?.find(c => c.id === cat.id);
                    return (
                      <SmallTableCell key={cat.id}>
                        {catSistema && catSistema.SistemaCategoriaHoras
                          ? catSistema.SistemaCategoriaHoras.horasContratadas
                          : <span style={{ color: "#bbb" }}>-</span>}
                      </SmallTableCell>
                    );
                  })}
                  <SmallTableCell>
                    {sistema.fechaDesde
                      ? sistema.fechaDesde.split("-").reverse().join("/")
                      : <span style={{ color: "#bbb" }}>-</span>}
                  </SmallTableCell>
                  <SmallTableCell>
                    {sistema.fechaHasta
                      ? sistema.fechaHasta.split("-").reverse().join("/")
                      : <span style={{ color: "#bbb" }}>-</span>}
                  </SmallTableCell>
                  <SmallTableCell>
                    {sistema.Cliente ? sistema.Cliente.nombre : <span style={{ color: "#bbb" }}>-</span>}
                  </SmallTableCell>
                  <SmallTableCell>
                    {sistema.usuarios && sistema.usuarios.length > 0
                      ? sistema.usuarios.map(u => u.nombre).join(", ")
                      : <span style={{ color: "#bbb" }}>-</span>}
                  </SmallTableCell>
                  <SmallTableCell align="center">
                    <IconButton onClick={() => handleEdit(sistema)} title="Editar" size="small" sx={{ color: "#1976d2" }}>
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(sistema.id)} title="Eliminar" size="small" sx={{ color: "#e57373" }}>
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </SmallTableCell>
                </SmallTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: "1.1rem" }}>{editingSistema ? "Editar Sistema" : "Agregar Sistema"}</DialogTitle>
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