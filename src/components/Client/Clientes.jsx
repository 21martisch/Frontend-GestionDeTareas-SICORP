import React, { useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateCliente from "./CreateCliente";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import {
    getClientes,
    deleteCliente
} from "../../store/apis/clientesApi";
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

const Clientes = ({ isMenuOpen, toggleMenu, filter, setFilter }) => {
    const [openModal, setOpenModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const queryClient = useQueryClient();
    const token = useSelector((state) => state.auth.token);

    const { data: clientes = [], isLoading } = useQuery({
        queryKey: ["clientes"],
        queryFn: () => getClientes(token).then(res => res.data),
    });

    const deleteClienteMutation = useMutation({
        mutationFn: (id) => deleteCliente(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["clientes"]);
        },
    });

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
            deleteClienteMutation.mutate(id);
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setOpenModal(true);
    };

    const handleAdd = () => {
        setEditingCliente(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingCliente(null);
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
                    Clientes
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
                    Agregar Cliente
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}>
                <Table size="small">
                    <TableHead>
                        <SmallTableRow sx={{ background: "#f5f5f5" }}>
                            <SmallTableCell><b>Nombre</b></SmallTableCell>
                            <SmallTableCell><b>Email</b></SmallTableCell>
                            <SmallTableCell><b>Fecha de creación</b></SmallTableCell>
                            <SmallTableCell><b>Sistemas</b></SmallTableCell>
                            <SmallTableCell align="center"><b>Acciones</b></SmallTableCell>
                        </SmallTableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <SmallTableRow>
                                <SmallTableCell colSpan={5} align="center">Cargando...</SmallTableCell>
                            </SmallTableRow>
                        ) : (
                            clientes.map((cliente) => (
                                <SmallTableRow key={cliente.id}>
                                    <SmallTableCell>{cliente.nombre}</SmallTableCell>
                                    <SmallTableCell>{cliente.email}</SmallTableCell>
                                    <SmallTableCell>
                                        {new Date(cliente.createdAt).toLocaleDateString()}
                                    </SmallTableCell>
                                    <SmallTableCell>
                                        {cliente.Sistemas && cliente.Sistemas.length > 0
                                            ? cliente.Sistemas.map(s => s.nombre).join(", ")
                                            : <span style={{ color: "#bbb" }}>Sin sistemas</span>
                                        }
                                    </SmallTableCell>
                                    <SmallTableCell align="center">
                                        <IconButton onClick={() => handleEdit(cliente)} title="Editar" size="small" sx={{ color: "#1976d2" }}>
                                            <Edit sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(cliente.id)} title="Eliminar" size="small" sx={{ color: "#e57373" }}>
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
                <DialogTitle sx={{ fontSize: "1.1rem" }}>{editingCliente ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
                <DialogContent>
                    <CreateCliente
                        cliente={editingCliente}
                        onClose={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Clientes;