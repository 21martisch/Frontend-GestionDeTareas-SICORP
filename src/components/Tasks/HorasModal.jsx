import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Alert } from "@mui/material";

const HorasModal = ({ open, handleClose, handleSubmit, initialHoras }) => {
  const [horas, setHoras] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setHoras(initialHoras !== undefined && initialHoras !== null ? String(initialHoras) : "");
    setError("");
  }, [initialHoras, open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (horas !== "" && !isNaN(Number(horas))) {
      try {
        const ok = await handleSubmit(Number(horas));
        if (ok) handleClose();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Error al cargar horas"
        );
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          margin="normal"
          label="Horas cargadas"
          type="number"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Guardar horas
        </Button>
      </Box>
    </Modal>
  );
};

export default HorasModal;