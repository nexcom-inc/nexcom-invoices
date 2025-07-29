import React, { useState } from "react";
import { useApi, useAsyncAction } from "../../hooks/useApi";
import { apiService } from "../../services/api";
import { Organization, CreateOrganizationDto } from "../../types/api";
import { Building2, Plus, Edit, MapPin, Globe, Loader2 } from "lucide-react";
import { OrganizationForm } from "./OrganizationForm";
import { useToast } from "../UI/Toast";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

interface OrganizationListProps {
  onOrganizationSelect: (organizationId: string) => void;
}

export function OrganizationList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess } = useToast();
  const {
    data: organizations,
    loading,
    refetch,
  } = useApi(() => apiService.getOrganizations());
  const { execute: createOrganization, loading: creating } = useAsyncAction(
    apiService.createOrganization
  );

  const handleCreateOrganization = async (data: CreateOrganizationDto) => {
    const result = await createOrganization(data);
    if (result) {
      showSuccess(
        "Organization Created",
        "Organization has been successfully created"
      );
      setShowCreateForm(false);
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage your company organizations</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
        >
          Create Organization
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader title="Create New Organization" />
          <OrganizationForm
            onSubmit={handleCreateOrganization}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(organizations || []).map((organization) => (
          <Card
            key={organization.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <Button
                variant="secondary"
                size="sm"
              >
                Select
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {organization.name}
            </h3>

            {organization.domain && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Globe className="w-4 h-4 mr-2" />
                {organization.domain}
              </div>
            )}

            {organization.address && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                {organization.address}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Language: {organization.language || "fr"}</span>
              <span>Currency: {organization.currency || "XOF"}</span>
            </div>
          </Card>
        ))}
      </div>

      {(organizations || []).length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first organization
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              Create Organization
              <Plus className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
