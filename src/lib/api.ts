/* eslint-disable @typescript-eslint/no-explicit-any */


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

// Organizations API
export const organizationsApi = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/organizations`)
    return response.json()
  },

  getById: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}`)
    return response.json()
  },
}

// Clients API
export const clientsApi = {
  create: async (organizationId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getAll: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/clients`)
    return response.json()
  },

  getById: async (organizationId: string, clientId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/clients/${clientId}`)
    return response.json()
  },
}

// Items API
export const itemsApi = {
  create: async (organizationId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getAll: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/items`)
    return response.json()
  },

  getById: async (organizationId: string, itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/items/${itemId}`)
    return response.json()
  },
}

// Taxes API
export const taxesApi = {
  create: async (organizationId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/taxes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getAll: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/taxes`)
    return response.json()
  },

  getById: async (organizationId: string, taxId: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/taxes/${taxId}`)
    return response.json()
  },
}

// Invoices API
export const invoicesApi = {
  create: async (organizationId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getAll: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/invoices`)
    return response.json()
  },

  getById: async (organizationId: string, invoiceId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/invoices/${invoiceId}`)
    return response.json()
  },

  getPdf: async (organizationId: string, invoiceId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/invoices/${invoiceId}/pdf`)
    return response.blob()
  },

  send: async (organizationId: string, invoiceId: string) => {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/${invoiceId}/send`, {
      method: "POST",
    })
    return response.json()
  },
}

// Mailing API
export const mailingApi = {
  createConfig: async (organizationId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/mailing-config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getConfig: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/mailing-config`)
    return response.json()
  },

  testConnection: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/mailing/test-connection`)
    return response.json()
  },

  sendTestEmail: async (organizationId: string) => {
    const response = await fetch(`${API_BASE_URL}/settings/${organizationId}/mailing/send-test-email`, {
      method: "POST",
    })
    return response.json()
  },
}
