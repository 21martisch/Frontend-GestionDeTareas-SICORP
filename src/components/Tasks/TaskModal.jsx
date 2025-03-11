import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const TaskModal = ({ open, handleClose, handleSubmit, initialTask }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description);
        } else {
            setTitle("");
            setDescription("");
        }
    }, [initialTask]);

    useEffect(() => {
        if (!open) {
            setTitle("");
            setDescription("");
        }
    }, [open]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit({ title, description, _id: initialTask?._id });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <TextField
                    fullWidth
                    margin="normal"
                    label="Título de la tarea"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Descripción de la tarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {initialTask ? "Actualizar tarea" : "Agregar tarea"}
                </Button>
            </Box>
        </Modal>
    );
};

export default TaskModal;
