// API Response and Request Types based on Swagger Schema

export interface CreateOrganizationDto {
  name: string;
  domain?: string;
  address?: string;
  language?: 'fr' | 'en';
  currency?: string;
}

export interface Organization extends CreateOrganizationDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  displayName: string;
  gender?: 'MALE' | 'FEMALE' | 'UNSPECIFIED';
  type?: 'INDIVIDUAL' | 'BUSINESS';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  currency?: 'USD' | 'XOF' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SEK' | 'NZD';
  email?: string;
  phone?: string;
  businessNumber?: string;
  organizationId: string;
  ownerId?: string;
}

export interface Client extends CreateClientDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  price: number;
  type?: 'SERVICE' | 'PRODUCT';
  unit?: 'KG';
  organizationId: string;
  taxId?: string;
}

export interface Item extends CreateItemDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxDto {
  name: string;
  organizationId: string;
  rate: number;
}

export interface Tax extends CreateTaxDto {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceItemDto {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  taxId?: string;
}

export interface CreateInvoiceDto {
  invoiceNumber: string;
  clientId: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status?: 'PENDING' | 'DRAFT' | 'PAID' | 'OVERDUE' | 'PARTIALY_PAID' | 'CANCELLED' | 'REFUNDED';
  items: CreateInvoiceItemDto[];
  discount?: number;
  discountType?: 'PERCENTAGE' | 'AMOUNT';
}

export interface Invoice extends CreateInvoiceDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMailingConfigDto {
  provider: 'SMTP' | 'RESEND';
  fromAddress: string;
  fromName?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  resendApiKey?: string;
  isActive?: boolean;
}

export interface MailingConfig {
  id: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  configType: 'SMTP' | 'RESEND';
  ResendConfig ?: {
    fromAddress: string;
    fromName: string;
  }
  SmtpConfig ?: {
    host: string;
    port: number;
    username: string;
    secure: boolean;
  }
}

export interface CreateInvitationDto {
  email: string;
  role?: 'Owner' | 'Admin' | 'User' | 'Viewer';
}

export interface Invitation extends CreateInvitationDto {
  id: string;
  organizationId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}