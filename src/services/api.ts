/* eslint-disable */

import { Client, CreateClientDto, CreateInvitationDto, CreateInvoiceDto, CreateItemDto, CreateMailingConfigDto, CreateOrganizationDto, CreateTaxDto, Invitation, Invoice, Item, MailingConfig, Organization, Tax } from "@/types/api";

// API Service Layer with Token Management
const BASE_URL = process.env.NEXT_PUBLIC_API_INVOICE_URL

class ApiService {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {


    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        window.location.reload
      }

      // Handle structured error response
      if (result.details?.message && Array.isArray(result.details.message)) {
        const error = new Error(result.message || 'Validation Error');
        (error as any).details = result.details.message;
        throw error;
      }
      throw new Error(result.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // Extract data from structured API response
    return result.data || result;
  }

  // Organizations
  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.request('/organizations');
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    return this.request(`/organizations/${organizationId}`);
  }

  async getDefaultOrganization(): Promise<{ organizationId: string }> {
    return this.request('/organization/default');
  }

  // Clients
  async createClient(organizationId: string, data: CreateClientDto): Promise<Client> {
    return this.request(`/${organizationId}/clients`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClients(organizationId: string): Promise<Client[]> {
    return this.request(`/${organizationId}/clients`);
  }

  async getClient(organizationId: string, clientId: string): Promise<Client> {
    return this.request(`/${organizationId}/clients/${clientId}`);
  }

  // Items
  async createItem(organizationId: string, data: CreateItemDto): Promise<Item> {
    return this.request(`/${organizationId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getItems(organizationId: string): Promise<Item[]> {
    return this.request(`/${organizationId}/items`);
  }

  async getItem(organizationId: string, itemId: string): Promise<Item> {
    return this.request(`/${organizationId}/items/${itemId}`);
  }

  // Taxes
  async createTax(organizationId: string, data: CreateTaxDto): Promise<Tax> {
    return this.request(`/settings/${organizationId}/taxes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTaxes(organizationId: string): Promise<Tax[]> {
    return this.request(`/settings/${organizationId}/taxes`);
  }

  async getTax(organizationId: string, taxId: string): Promise<Tax> {
    return this.request(`/settings/${organizationId}/taxes/${taxId}`);
  }

  // Invoices
  async createInvoice(organizationId: string, data: CreateInvoiceDto): Promise<Invoice> {
    return this.request(`/${organizationId}/invoices`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInvoices(organizationId: string): Promise<Invoice[]> {
    return this.request(`/${organizationId}/invoices`);
  }

  async getInvoice(organizationId: string, invoiceId: string): Promise<Invoice> {
    return this.request(`/${organizationId}/invoices/${invoiceId}`);
  }

  async getInvoicePdf(organizationId: string, invoiceId: string): Promise<Blob> {
    
    const response = await fetch(`${BASE_URL}/${organizationId}/invoices/${invoiceId}/pdf`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get PDF: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  async sendInvoice(organizationId: string, invoiceId: string): Promise<void> {
    return this.request(`/${organizationId}/${invoiceId}/send`, {
      method: 'POST',
    });
  }

  // Mailing Config
  async createMailingConfig(organizationId: string, data: CreateMailingConfigDto): Promise<MailingConfig> {
    return this.request(`/settings/${organizationId}/mailing-config`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMailingConfig(organizationId: string): Promise<MailingConfig> {
    return this.request(`/settings/${organizationId}/mailing-config`);
  }

  async testMailingConnection(organizationId: string): Promise<void> {
    return this.request(`/settings/${organizationId}/mailing/test-connection`);
  }

  async sendTestEmail(organizationId: string): Promise<void> {
    return this.request(`/settings/${organizationId}/mailing/send-test-email`, {
      method: 'POST',
    });
  }

  // Invitations
  async createInvitation(organizationId: string, data: CreateInvitationDto): Promise<Invitation> {
    return this.request(`/organizations/${organizationId}/invitations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptInvitation(token: string): Promise<void> {
    return this.request(`/organizations/invitations/accept/${token}`);
  }
}

export const apiService = new ApiService();

// Usage examples:
// 1. URL with token: https://yourapp.com?access_token=your_token_here
// 2. Manually set token: apiService.setToken('your_token_here')
// 3. Check if authenticated: apiService.isAuthenticated()
// 4. Clear token: apiService.clearToken()