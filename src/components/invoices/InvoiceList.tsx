"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { useToast } from '../UI/Toast';
import { apiService } from '../../services/api';
import {  CreateInvoiceDto } from '../../types/api';
import { FileText, Plus, Download, Send } from 'lucide-react';
import { InvoiceForm } from './InvoiceForm';
import { useOrgId } from '@/hooks/organizations/useOrgId';

export function InvoiceList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess } = useToast();
  const organizationId = useOrgId() as string
  const { data: invoices, loading, refetch } = useApi(
    () => apiService.getInvoices(organizationId),
    [organizationId]
  );
  const { execute: createInvoice, loading: creating } = useAsyncAction(
    (data: CreateInvoiceDto) => apiService.createInvoice(organizationId, data)
  );
  const { execute: downloadPdf, loading: downloading } = useAsyncAction(
    (invoiceId: string) => apiService.getInvoicePdf(organizationId, invoiceId)
  );
  const { execute: sendInvoice, loading: sending } = useAsyncAction(
    (invoiceId: string) => apiService.sendInvoice(organizationId, invoiceId)
  );

  const handleCreateInvoice = async (data: CreateInvoiceDto) => {
    const result = await createInvoice(data);
    if (result) {
      showSuccess('Invoice Created', 'Invoice has been successfully created');
      setShowCreateForm(false);
      refetch();
    }
  };

  const handleDownloadPdf = async (invoiceId: string, invoiceNumber: string) => {
    const blob = await downloadPdf(invoiceId);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('PDF Downloaded', 'Invoice PDF has been downloaded');
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    const result = await sendInvoice(invoiceId);
    if (result !== null) {
      showSuccess('Invoice Sent', 'Invoice has been sent to the client');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'partialy_paid': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and billing</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Create Invoice
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader title="Create New Invoice" />
          <InvoiceForm
            onSubmit={handleCreateInvoice}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
            organizationId={organizationId}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {(invoices || []).map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-600">Client ID: {invoice.clientId}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">
                      Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${invoice.totalAmount.toLocaleString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status || 'draft')}`}>
                    {invoice.status || 'DRAFT'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownloadPdf(invoice.id, invoice.invoiceNumber)}
                    loading={downloading}
                    icon={<Download className="w-4 h-4" />}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendInvoice(invoice.id)}
                    loading={sending}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>

            {invoice.items && invoice.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                <div className="space-y-1">
                  {invoice.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.quantity * item.unitPrice).toLocaleString()}</span>
                    </div>
                  ))}
                  {invoice.items.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{invoice.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {(invoices || []).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-4">Create your first invoice to get started</p>
            <Button 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateForm(true)}
            >
              Create Invoice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}