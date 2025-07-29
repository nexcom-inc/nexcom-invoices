"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { useToast } from '../UI/Toast';
import { apiService } from '../../services/api';
import { CreateItemDto } from '../../types/api';
import { Package, Plus, DollarSign, Tag } from 'lucide-react';
import { ItemForm } from './ItemForm';
import { useOrgId } from '@/hooks/organizations/useOrgId';

interface ItemListProps {
  organizationId: string;
}

export function ItemList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess } = useToast();
  const organizationId = useOrgId() as string
  const { data: items, loading, refetch } = useApi(
    () => apiService.getItems(organizationId),
    [organizationId]
  );
  const { execute: createItem, loading: creating } = useAsyncAction(
    (data: CreateItemDto) => apiService.createItem(organizationId, data)
  );

  const handleCreateItem = async (data: CreateItemDto) => {
    const result = await createItem(data);
    if (result) {
      showSuccess('Item Created', 'Item has been successfully created');
      setShowCreateForm(false);
      refetch();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-green-100 text-green-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600">Manage your products and services</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Add Item
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader title="Add New Item" />
          <ItemForm
            onSubmit={handleCreateItem}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
            organizationId={organizationId}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(items || []).map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type || 'service')}`}>
                {item.type || 'SERVICE'}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
            
            {item.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
            )}
            
            <div className="flex items-center text-lg font-bold text-green-600 mb-3">
              {Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price)}
            </div>
            
            {item.unit && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Tag className="w-4 h-4 mr-2" />
                Unit: {item.unit}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Cree le: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {(items || []).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Add your first item to get started</p>
            <Button 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateForm(true)}
            >
              Add Item
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}