import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Tasks/Dashboard";
import Clientes from "./components/Client/Clientes";
import Historial from "./components/Tasks/Historial";
import Detalle from "./components/Tasks/Detalle";
import PrivateRoute from "./components/Private/PrivateRoute";
import HorasContrato from "./components/HorasContrato/HorasContrato";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Usuarios from "./components/Usuarios/Usuarios";
import Sistemas from "./components/Sistemas/Sistemas";
import Layout from "./components/Sidebar/Layout";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/historial/:ticketId" element={<Historial />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/detalle/:ticketId" element={<Detalle />} />
        </Route>

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route
            path="/clientes"
            element={
              <Layout>
                <Clientes />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route
            path="/usuarios"
            element={
              <Layout>
                <Usuarios />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route
            path="/sistemas"
            element={
              <Layout>
                <Sistemas />
              </Layout>
            }
          />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="/horas-contrato"
            element={
              <Layout>
                <HorasContrato />
              </Layout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;