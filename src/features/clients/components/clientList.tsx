"use client";

import { useOrgId } from "@/hooks/organizations/useOrgId";
import React from "react";
import { useClients } from "../hooks/use-clients";

const ClientList = () => {
  const orgId = useOrgId() as string;
  const { data: clients } = useClients(orgId);

  return (
    <div>
      <h1>Client List</h1>
      <ul>
        {clients?.map((client) => (
          <li key={client.id}>{client.displayName}</li>
        ))}
      </ul>
    </div>
  )
};

export default ClientList;
