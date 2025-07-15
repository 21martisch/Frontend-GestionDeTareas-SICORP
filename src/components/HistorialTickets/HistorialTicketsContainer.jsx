import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HistorialTickets from "./HistorialTickets";
import { getTickets } from "../../store/apis/ticketsApi";
import { getSistemas } from "../../store/apis/sistemasApi";
import { useSelector } from "react-redux";

const HistorialTicketsContainer = (props) => {
  const token = useSelector((state) => state.auth.token);
  const [page, setPage] = useState(1);

  const { data = { tickets: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["tickets", "cerrados", page],
    queryFn: async () => {
      const { data } = await getTickets({ estado: "Cerrado", page, limit: 10 }, token);
      return data;
    },
    enabled: !!token,
  });

  const { data: clientesData = { data: [] }, isLoading: loadingClientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data } = await getClientes(token);
      return data;
    },
    enabled: !!token,
  });

  const { data: sistemasData = [], isLoading: loadingSistemas } = useQuery({
    queryKey: ["sistemas"],
    queryFn: async () => {
      const { data } = await getSistemas({}, token);
      return data;
    },
    enabled: !!token,
  });

  return (
    <HistorialTickets
      tickets={data.tickets}
      total={data.total}
      clientes={clientesData || []}
      isLoading={isLoading || loadingClientes || loadingSistemas}
      sistemas={sistemasData || []}
      page={page}
      setPage={setPage}
      {...props}
    />
  );
};

export default HistorialTicketsContainer;