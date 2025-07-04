import React, { useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { Edit, Delete, Lock, Add } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import CreateUsuario from "./CreateUsuario";
import ChangePasswordModal from "./ChangePasswordModal";
import TablePagination from "@mui/material/TablePagination";
import {
    getUsuarios,
    deleteUsuario
} from "../../store/apis/usuariosApi";

const Usuarios = ({ isMenuOpen, toggleMenu, filter, setFilter }) => {
    const [openModal, setOpenModal] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const queryClient = useQueryClient();
    const token = useSelector((state) => state.auth.token);

    const { data, isLoading } = useQuery({
        queryKey: ["usuarios", page, rowsPerPage],
        queryFn: () =>
            getUsuarios({ page: page + 1, limit: rowsPerPage }, token).then(res => res.data),
    });

    const usuarios = data?.users || [];
    const total = data?.total || 0;

    const deleteUsuarioMutation = useMutation({
        mutationFn: (id) => deleteUsuario(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["usuarios"]);
        },
    });

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
            deleteUsuarioMutation.mutate(id);
        }
    };

    const handleEdit = (usuario) => {
        setEditingUsuario(usuario);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setEditingUsuario(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingUsuario(null);
    };

    const handleOpenPasswordModal = (id) => {
        setSelectedUsuarioId(id);
        setOpenPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
        setSelectedUsuarioId(null);
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
                <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>Usuarios</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Agregar Usuario
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Fecha de creación</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Cargando...</TableCell>
                            </TableRow>
                        ) : (
                            usuarios
                            .map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.nombre}</TableCell>
                                    <TableCell>{usuario.apellido}</TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.rol}</TableCell>
                                    <TableCell>
                                        {new Date(usuario.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {usuario.cliente ? usuario.cliente.nombre : <span style={{ color: "#bbb" }}>Sin cliente</span>}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEdit(usuario)} title="Editar">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(usuario.id)} title="Eliminar">
                                            <Delete />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenPasswordModal(usuario.id)} title="Cambiar contraseña">
                                            <Lock />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Usuarios por página"
                />
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{editingUsuario ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
                <DialogContent>
                    <CreateUsuario
                        usuario={editingUsuario}
                        onClose={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
            <ChangePasswordModal
                open={openPasswordModal}
                onClose={handleClosePasswordModal}
                usuarioId={selectedUsuarioId}
            />
        </Box>
    );
};

export default Usuarios;