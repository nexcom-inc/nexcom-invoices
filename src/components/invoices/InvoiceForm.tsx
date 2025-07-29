"use client";

import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { CreateInvoiceDto, CreateInvoiceItemDto } from '../../types/api';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  onSubmit: (data: CreateInvoiceDto) => void;
  onCancel: () => void;
  loading?: boolean;
  invoice?: CreateInvoiceDto;
  organizationId: string;
}

export function InvoiceForm({ onSubmit, onCancel, loading, invoice, organizationId }: InvoiceFormProps) {
  const { data: clients } = useApi(() => apiService.getClients(organizationId), [organizationId]);
  const { data: items } = useApi(() => apiService.getItems(organizationId), [organizationId]);

  const [formData, setFormData] = useState<CreateInvoiceDto>({
    invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
    clientId: invoice?.clientId || '',
    invoiceDate: "2025-07-28T00:00:00.000Z",
    dueDate: "2025-08-29T00:00:00.000Z",
    totalAmount: invoice?.totalAmount || 0,
    status: invoice?.status || 'DRAFT',
    items: invoice?.items || [{ itemId: '', name: '', quantity: 1, unitPrice: 0 }],
    discount: invoice?.discount || 0,
    discountType: invoice?.discountType || 'PERCENTAGE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = calculateTotal();
    onSubmit({ ...formData,
                  invoiceDate: "2025-07-28T00:00:00.000Z",
                  dueDate: "2025-08-29T00:00:00.000Z",
                  totalAmount: calculatedTotal });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'discount' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleItemChange = (index: number, field: keyof CreateInvoiceItemDto, value: string | number) => {
    const updatedItems = [...formData.items];
    if (field === 'itemId' && typeof value === 'string') {
      const selectedItem = (items || []).find(item => item.id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemId: value,
          name: selectedItem.name,
          unitPrice: selectedItem.price
        };
      }
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', name: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === 'PERCENTAGE') {
      return subtotal * (formData.discount ?? 0 / 100);
    }
    return formData.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (calculateDiscount() ?? 0);
  };

  if (!clients || !items) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number *
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            required
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Client *
          </label>
          <select
            id="clientId"
            name="clientId"
            required
            value={formData.clientId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date *
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            required
            value={formData.invoiceDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PARTIALY_PAID">Partially Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addItem} icon={<Plus className="w-4 h-4" />}>
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border border-gray-200 rounded-lg">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                title='Item'
                  value={item.itemId}
                  onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select item</option>
                  {items.map((availableItem) => (
                    <option key={availableItem.id} value={availableItem.id}>
                      {availableItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                title='Quantity'
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input
                title='Unit Price'
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {(item.quantity * item.unitPrice).toLocaleString()}
                </div>
              </div>

              <div className="col-span-2">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Discount
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            min="0"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Type
          </label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="AMOUNT">Amount</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-{calculateDiscount()?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {invoice ? 'Update' : 'Create'} Invoice
        </Button>
      </div>
    </form>
  );
}