export interface Organization {
  id?: string
  name: string
  domain?: string
  address?: string
  language?: "fr" | "en"
  currency?: string
}

export interface Client {
  id?: string
  displayName: string
  gender?: "MALE" | "FEMALE" | "UNSPECIFIED"
  type?: "INDIVIDUAL" | "BUSINESS"
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  firstName?: string
  lastName?: string
  companyName?: string
  currency?: "USD" | "XOF" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD"
  email?: string
  phone?: string
  businessNumber?: string
  organizationId: string
  ownerId?: string
}

export interface Item {
  id?: string
  name: string
  description?: string
  price: number
  type?: "SERVICE" | "PRODUCT"
  unit?: "KG"
  organizationId: string
  taxId?: string
}

export interface Tax {
  id?: string
  name: string
  organizationId: string
  rate: number
}

export interface InvoiceItem {
  itemId: string
  name: string
  quantity: number
  unitPrice: number
  taxId?: string
}

export interface Invoice {
  id?: string
  invoiceNumber: string
  clientId: string
  invoiceDate: Date
  dueDate: Date
  totalAmount: number
  status?: "PENDING" | "DRAFT" | "PAID" | "OVERDUE" | "PARTIALY_PAID" | "CANCELLED" | "REFUNDED" | string
  items: InvoiceItem[]
  discount?: number
  discountType?: "PERCENTAGE" | "AMOUNT" | string
}

export interface MailingConfig {
  id?: string
  provider: "SMTP" | "RESEND"
  fromAddress: string
  fromName?: string
  smtpHost?: string
  smtpPort?: number
  smtpUsername?: string
  smtpPassword?: string
  smtpSecure?: boolean
  resendApiKey?: string
  isActive?: boolean
}
