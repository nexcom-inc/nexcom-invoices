"use client"

import React, { useState } from 'react';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { useToast } from '../UI/Toast';
import { apiService } from '../../services/api';
import { Client, CreateClientDto } from '../../types/api';
import { Users, Plus, User, Building, Mail, Phone } from 'lucide-react';
import { ClientForm } from './ClientForm';
import { useOrgId } from '@/hooks/organizations/useOrgId';


export function ClientList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess } = useToast();
  const organizationId = useOrgId() as string
  const { data: clients, loading, refetch } = useApi(
    () => apiService.getClients(organizationId),
    [organizationId]
  );
  const { execute: createClient, loading: creating } = useAsyncAction(
    (data: CreateClientDto) => apiService.createClient(organizationId, data)
  );

  const handleCreateClient = async (data: CreateClientDto) => {
    const result = await createClient({ ...data, organizationId });
    if (result) {
      showSuccess('Client Created', 'Client has been successfully created');
      setShowCreateForm(false);
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your organization clients</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Add Client
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader title="Add New Client" />
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(clients || []).map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                {client.type === 'BUSINESS' ? (
                  <Building className="w-6 h-6 text-green-600" />
                ) : (
                  <User className="w-6 h-6 text-green-600" />
                )}
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status || 'active')}`}>
                {client.status || 'active'}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.displayName}</h3>
            
            {client.type === 'BUSINESS' && client.companyName && (
              <p className="text-sm text-gray-600 mb-2">{client.companyName}</p>
            )}
            
            {(client.firstName || client.lastName) && (
              <p className="text-sm text-gray-600 mb-2">
                {client.firstName} {client.lastName}
              </p>
            )}
            
            {client.email && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                {client.email}
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4 mr-2" />
                {client.phone}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Type: {client.type || 'INDIVIDUAL'}</span>
              <span>Currency: {client.currency || 'XOF'}</span>
            </div>
          </Card>
        ))}
      </div>

      {(clients || []).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-4">Add your first client to get started</p>
            <Button 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateForm(true)}
            >
              Add Client
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}