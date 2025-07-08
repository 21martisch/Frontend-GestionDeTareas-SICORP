import React from "react";
import { Typography } from "@mui/material";

const NoTasksMessage = ({ filter }) => {
  const getNoTasksMessage = () => {
    switch (filter) {
      case "favorites":
        return "No hay tareas importantes.";
      case "completed":
        return "No hay tareas finalizadas.";
      case "incomplete":
        return "No hay tareas pendientes.";
      default:
        return "No hay tickets, oprima el botón 'Agregar tickets'.";
    }
  };

  return (
    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
      {getNoTasksMessage()}
    </Typography>
  );
};

export default NoTasksMessage;