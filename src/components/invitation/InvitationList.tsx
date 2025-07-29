"use client";

import React, { useState } from "react";
import { Card, CardHeader } from "../UI/Card";
import { Button } from "../UI/Button";
import { useAsyncAction } from "../../hooks/useApi";
import { useToast } from "../UI/Toast";
import { apiService } from "../../services/api";
import { CreateInvitationDto } from "../../types/api";
import { UserPlus, Send, Users } from "lucide-react";

interface InvitationListProps {
  organizationId: string;
}

export function InvitationList({ organizationId }: InvitationListProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const { showSuccess } = useToast();
  const { execute: createInvitation, loading: creating } = useAsyncAction(
    (data: CreateInvitationDto) =>
      apiService.createInvitation(organizationId, data)
  );

  const [formData, setFormData] = useState<CreateInvitationDto>({
    email: "",
    role: "User",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createInvitation(formData);
    if (result) {
      showSuccess(
        "Invitation Sent",
        `Invitation has been sent to ${formData.email}`
      );
      setShowInviteForm(false);
      setFormData({ email: "", role: "User" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const roles = [
    {
      value: "Owner",
      label: "Owner",
      description: "Full access to all features",
    },
    {
      value: "Admin",
      label: "Admin",
      description: "Manage users and settings",
    },
    { value: "User", label: "User", description: "Create and manage invoices" },
    { value: "Viewer", label: "Viewer", description: "View-only access" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Invitations</h1>
          <p className="text-gray-600">
            Invite team members to your organization
          </p>
        </div>
        <Button
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setShowInviteForm(true)}
        >
          Send Invitation
        </Button>
      </div>

      {showInviteForm && (
        <Card>
          <CardHeader title="Invite Team Member" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="colleague@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {roles.find((r) => r.value === formData.role)?.description}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowInviteForm(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={creating}
                icon={<Send className="w-4 h-4" />}
              >
                Send Invitation
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <span
          onClick={() => setShowInviteForm(true)}
        >
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Invite Team Member
            </h3>
            <p className="text-gray-600">
              Send an invitation to join your organization
            </p>
          </div>
        </Card>
        </span>
      </div>

      <Card>
        <CardHeader title="Role Permissions" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.value}
              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{role.label}</h4>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
