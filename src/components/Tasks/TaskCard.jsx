import React from "react";
import { Card, CardContent, CardActions, Typography, IconButton, Chip } from "@mui/material";
import { Star, StarBorder, Edit, Delete } from "@mui/icons-material";

const TaskCard = ({ task, handleCompleteTask, handleToggleFavorite, handleOpenModal, handleDeleteTask }) => {
  return (
    <Card sx={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Typography variant="h6" noWrap>{task.title}</Typography>
        <Typography color="textSecondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {task.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => handleCompleteTask(task)}>
          {task.completed ? <Chip label="Completada" color="success" /> : <Chip label="Pendiente" color="warning" />}
        </IconButton>
        <IconButton onClick={() => handleToggleFavorite(task)}>
          {task.favorite ? <Star color="warning" /> : <StarBorder />}
        </IconButton>
        <IconButton onClick={() => handleOpenModal(task)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => handleDeleteTask(task._id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;