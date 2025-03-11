import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Typography, Box, CircularProgress, Button, Grid, Pagination, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from "./Sidebar";
import TaskModal from "./TaskModal";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TaskCard from "./TaskCard";
import NoTasksMessage from "./NoTasksMessage";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [initialTask, setInitialTask] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const token = useAuth();

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const fetchTasks = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { filter, page, limit: 10 },
    });
    return data;
  };

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ["tasks", filter, page],
    queryFn: fetchTasks,
    enabled: !!token,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => 
      axios.post(`${import.meta.env.VITE_API_URL}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      handleCloseModal();
      toast.success('Tarea agregada con éxito');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => 
      axios.put(`${import.meta.env.VITE_API_URL}/tasks/${updatedTask._id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["tasks"]);
      handleCloseModal();
      if (variables.completed === undefined) {
        toast.success('Tarea actualizada con éxito');
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) =>
      axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success('Tarea eliminada con éxito');
      if (tasksData?.tasks.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
  });

  const handleOpenModal = (task = null) => {
    setInitialTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialTask(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const handleCompleteTask = (task) => {
    const isCompleted = !task.completed;
    updateTaskMutation.mutate({ ...task, completed: isCompleted }, {
      onSuccess: () => {
        if (isCompleted) {
          toast.success('Tarea completada con éxito');
        }
      }
    });
  };

  const handleToggleFavorite = (task) => {
    updateTaskMutation.mutate({ ...task, favorite: !task.favorite });
  };

  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar la tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  if (!token) {
    return <Typography color="error">No se encontró el token de autenticación. Por favor, inicie sesión.</Typography>;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box sx={{ mt: 4, ml: { lg: '18rem', xs: '2rem' }, mr: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { lg: 'none', xs: 'block' } }}
          onClick={toggleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', lg: '2rem' } }}>
          Panel de Tareas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          startIcon={<AddIcon />}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Agregar tarea
        </Button>
        <IconButton
          color="primary"
          aria-label="add task"
          onClick={() => handleOpenModal()}
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Sidebar setFilter={setFilter} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <TaskModal open={openModal} handleClose={handleCloseModal} handleSubmit={addTaskMutation.mutate} initialTask={initialTask} />
      
      {tasksData.tasks.length === 0 ? (
        <NoTasksMessage filter={filter} />
      ) : (
        <>
          <Grid container spacing={2}>
            {tasksData.tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={task._id}>
                <TaskCard
                  task={task}
                  handleCompleteTask={handleCompleteTask}
                  handleToggleFavorite={handleToggleFavorite}
                  handleOpenModal={handleOpenModal}
                  handleDeleteTask={handleDeleteTask}
                />
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={Math.ceil(tasksData.total / 10)}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
    </Box>
  );
};

export default Dashboard;
