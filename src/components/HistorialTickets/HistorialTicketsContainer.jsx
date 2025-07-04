import React from "react";
import { useQuery } from "@tanstack/react-query";
import HistorialTickets from "./HistorialTickets";
import { getTickets } from "../../store/apis/ticketsApi";
import { useSelector } from "react-redux";

const HistorialTicketsContainer = (props) => {
  const token = useSelector((state) => state.auth.token);
  const { data = { tickets: [] }, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await getTickets({}, token);
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
  return (
    <HistorialTickets tickets={data.tickets} clientes={clientesData || []} isLoading={isLoading || loadingClientes} {...props} />
  );
};

export default HistorialTicketsContainer;