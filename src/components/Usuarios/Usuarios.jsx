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
import { styled } from "@mui/material/styles";
import {
    getUsuarios,
    deleteUsuario
} from "../../store/apis/usuariosApi";

// Estilos comprimidos
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
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', lg: '1.5rem' } }}>
                    Usuarios
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
                    Agregar Usuario
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}>
                <Table size="small">
                    <TableHead>
                        <SmallTableRow sx={{ background: "#f5f5f5" }}>
                            <SmallTableCell><b>Nombre</b></SmallTableCell>
                            <SmallTableCell><b>Apellido</b></SmallTableCell>
                            <SmallTableCell><b>Email</b></SmallTableCell>
                            <SmallTableCell><b>Rol</b></SmallTableCell>
                            <SmallTableCell><b>Fecha de creación</b></SmallTableCell>
                            <SmallTableCell><b>Cliente</b></SmallTableCell>
                            <SmallTableCell align="center"><b>Acciones</b></SmallTableCell>
                        </SmallTableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <SmallTableRow>
                                <SmallTableCell colSpan={7} align="center">Cargando...</SmallTableCell>
                            </SmallTableRow>
                        ) : (
                            usuarios.map((usuario) => (
                                <SmallTableRow key={usuario.id}>
                                    <SmallTableCell>{usuario.nombre}</SmallTableCell>
                                    <SmallTableCell>{usuario.apellido}</SmallTableCell>
                                    <SmallTableCell>{usuario.email}</SmallTableCell>
                                    <SmallTableCell>
                                        <Box sx={{
                                            bgcolor: usuario.rol === "admin" ? "#e3f2fd" : "#f9fbe7",
                                            color: "#1976d2",
                                            px: 1, py: 0.2,
                                            borderRadius: 1,
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                            display: "inline-block"
                                        }}>
                                            {usuario.rol}
                                        </Box>
                                    </SmallTableCell>
                                    <SmallTableCell>
                                        {new Date(usuario.createdAt).toLocaleDateString()}
                                    </SmallTableCell>
                                    <SmallTableCell>
                                        {usuario.cliente
                                            ? <span>{usuario.cliente.nombre}</span>
                                            : <span style={{ color: "#bbb", fontStyle: "italic" }}>Sin cliente</span>
                                        }
                                    </SmallTableCell>
                                    <SmallTableCell align="center">
                                        <IconButton onClick={() => handleEdit(usuario)} title="Editar" size="small" sx={{ color: "#1976d2" }}>
                                            <Edit sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(usuario.id)} title="Eliminar" size="small" sx={{ color: "#e57373" }}>
                                            <Delete sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenPasswordModal(usuario.id)} title="Cambiar contraseña" size="small" sx={{ color: "#888" }}>
                                            <Lock sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </SmallTableCell>
                                </SmallTableRow>
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
                    sx={{
                        ".MuiTablePagination-toolbar": { minHeight: 36, fontSize: "0.95rem" },
                        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { fontSize: "0.95rem" }
                    }}
                />
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: "1.1rem" }}>{editingUsuario ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
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