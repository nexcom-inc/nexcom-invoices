"use client"

import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { CreateTaxDto } from '../../types/api';

interface TaxFormProps {
  onSubmit: (data: CreateTaxDto) => void;
  onCancel: () => void;
  loading?: boolean;
  tax?: CreateTaxDto;
  organizationId: string;
}

export function TaxForm({ onSubmit, onCancel, loading, tax, organizationId }: TaxFormProps) {
  const [formData, setFormData] = useState<CreateTaxDto>({
    name: tax?.name || '',
    organizationId: organizationId,
    rate: tax?.rate || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'rate' ? parseFloat(value) || 0 : value 
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tax Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., VAT 18%"
        />
      </div>

      <div>
        <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
          Tax Rate (%) *
        </label>
        <input
          type="number"
          id="rate"
          name="rate"
          required
          min="0"
          max="100"
          step="0.01"
          value={formData.rate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="18.00"
        />
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
          {tax ? 'Update' : 'Add'} Tax
        </Button>
      </div>
    </form>
  );
}