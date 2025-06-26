import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const HorasModal = ({ open, handleClose, handleSubmit, initialHoras }) => {
  const [horas, setHoras] = useState("");

  useEffect(() => {
    setHoras(initialHoras !== undefined && initialHoras !== null ? String(initialHoras) : "");
  }, [initialHoras, open]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (horas !== "" && !isNaN(Number(horas))) {
      handleSubmit(Number(horas));
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