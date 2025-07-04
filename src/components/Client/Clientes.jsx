import React, { useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { Edit, Delete, Lock, Add } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateCliente from "./CreateCliente";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import {
    getClientes,
    deleteCliente
} from "../../store/apis/clientesApi"; 

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
        <Box sx={{
            mt: 4,
            ml: `calc(${isMenuOpen ? '12rem' : '0px'} + 2rem)`,
            mr: '2rem',
            transition: 'margin-left 0.3s',
        }}>
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
                <Typography variant="h4">Clientes</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Agregar Cliente
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Fecha de creación</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Cargando...</TableCell>
                            </TableRow>
                        ) : (
                            clientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell>
                                        {new Date(cliente.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEdit(cliente)} title="Editar">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(cliente.id)} title="Eliminar">
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
                <DialogTitle>{editingCliente ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
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