"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { useToast } from '../UI/Toast';
import { apiService } from '../../services/api';
import { CreateTaxDto } from '../../types/api';
import { Calculator, Plus, Percent } from 'lucide-react';
import { TaxForm } from './TaxForm';

interface TaxListProps {
  organizationId: string;
}

export function TaxList({ organizationId }: TaxListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess } = useToast();
  const { data: taxes, loading, refetch } = useApi(
    () => apiService.getTaxes(organizationId),
    [organizationId]
  );
  const { execute: createTax, loading: creating } = useAsyncAction(
    (data: CreateTaxDto) => apiService.createTax(organizationId, data)
  );

  const handleCreateTax = async (data: CreateTaxDto) => {
    const result = await createTax(data);
    if (result) {
      showSuccess('Tax Created', 'Tax has been successfully created');
      setShowCreateForm(false);
      refetch();
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
          <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
          <p className="text-gray-600">Configure tax rates for your organization</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Add Tax
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader title="Add New Tax" />
          <TaxForm
            onSubmit={handleCreateTax}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
            organizationId={organizationId}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(taxes || []).map((tax) => (
          <Card key={tax.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calculator className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center text-2xl font-bold text-orange-600">
                <Percent className="w-5 h-5 mr-1" />
                {tax.rate}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tax.text}</h3>
            
            <div className="text-sm text-gray-600 mb-4">
              Rate: {tax.rate}% tax will be applied to items
            </div>
            
            <div className="text-xs text-gray-500">
              Created: {new Date(tax.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {(taxes || []).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No taxes configured</h3>
            <p className="text-gray-600 mb-4">Add your first tax rate to get started</p>
            <Button 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateForm(true)}
            >
              Add Tax
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}