"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '../UIB/Card';
import { Button } from '../UIB/Button';
import { LoadingSpinner } from '../UIB/LoadingSpinner';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import { useToast } from '../UIB/Toast';
import { apiService } from '../../services/api';
import { CreateMailingConfigDto } from '../../types/api';
import { Mail, Send, TestTube, Settings } from 'lucide-react';
import { useOrgId } from '@/hooks/organizations/useOrgId';

interface MailingConfigProps {
  organizationId: string;
}

export function MailingConfig() {
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess } = useToast();
  const organizationId = useOrgId() as string;
  const { data: config, loading, refetch } = useApi(
    () => apiService.getMailingConfig(organizationId),
    [organizationId],
    false // Don't show error toast for 404 (no config exists yet)
  );
  const { execute: createConfig, loading: creating } = useAsyncAction(
    (data: CreateMailingConfigDto) => apiService.createMailingConfig(organizationId, data)
  );
  const { execute: testConnection, loading: testing } = useAsyncAction(
    () => apiService.testMailingConnection(organizationId)
  );
  const { execute: sendTestEmail, loading: sendingTest } = useAsyncAction(
    () => apiService.sendTestEmail(organizationId)
  );

  const [formData, setFormData] = useState<CreateMailingConfigDto>({
    provider: 'SMTP',
    fromAddress: '',
    fromName: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    resendApiKey: '',
    isActive: true
  });

  React.useEffect(() => {
    if (config) {
      setFormData({
        provider: config.configType,
        fromAddress: config.ResendConfig?.fromAddress || '',
        fromName: config.ResendConfig?.fromName || '',
        smtpHost: config.SmtpConfig?.host || '',
        smtpPort: config.SmtpConfig?.port || 587,
        smtpUsername: config.SmtpConfig?.username || '',
        smtpPassword: '',
        smtpSecure: config.SmtpConfig?.secure || true,
        resendApiKey: '',
        isActive: true
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createConfig(formData);
    if (result) {
      showSuccess('Mailing Config Saved', 'Mailing configuration has been successfully saved');
      setIsEditing(false);
      refetch();
    }
  };

  const handleTestConnection = async () => {
    const result = await testConnection();
    if (result !== null) {
      showSuccess('Connection Test Successful', 'Mailing configuration is working correctly');
    }
  };

  const handleSendTestEmail = async () => {
    const result = await sendTestEmail();
    if (result !== null) {
      showSuccess('Test Email Sent', 'Test email has been sent successfully');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseInt(value) || 0 : value
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Mailing Configuration</h1>
          <p className="text-gray-600">Configure email settings for sending invoices</p>
        </div>
        {config && !isEditing && (
          <div className="flex space-x-3">
            <Button 
              variant="secondary"
              icon={<TestTube className="w-4 h-4" />}
              onClick={handleTestConnection}
              loading={testing}
            >
              Test Connection
            </Button>
            <Button 
              variant="secondary"
              icon={<Send className="w-4 h-4" />}
              onClick={handleSendTestEmail}
              loading={sendingTest}
            >
              Send Test Email
            </Button>
            <Button 
              icon={<Settings className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
            >
              Edit Config
            </Button>
          </div>
        )}
      </div>

      <Card>
        {config && !isEditing ? (
          <div>
            <CardHeader title="Current Configuration" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider</label>
                  <div className="mt-1 flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{config.configType}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Address</label>
                  <div className="mt-1 text-gray-900">{config.ResendConfig?.fromAddress ?? config.SmtpConfig?.username ?? 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Name</label>
                  <div className="mt-1 text-gray-900">{config.ResendConfig?.fromName ?? config.SmtpConfig?.username ?? 'Not set'}</div>
                </div>
              </div>
              <div className="space-y-4">
                {config.configType === 'SMTP' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                      <div className="mt-1 text-gray-900">{config.SmtpConfig?.host}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                      <div className="mt-1 text-gray-900">{config.SmtpConfig?.port}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Secure Connection</label>
                      <div className="mt-1 text-gray-900">{config.SmtpConfig?.secure ? 'Yes' : 'No'}</div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {true ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardHeader title={config ? "Edit Mailing Configuration" : "Setup Mailing Configuration"} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Provider *
                </label>
                <select
                  id="provider"
                  name="provider"
                  required
                  value={formData.provider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SMTP">SMTP</option>
                  <option value="RESEND">Resend</option>
                </select>
              </div>

              <div>
                <label htmlFor="fromAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  From Address *
                </label>
                <input
                  type="email"
                  id="fromAddress"
                  name="fromAddress"
                  required
                  value={formData.fromAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="noreply@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-1">
                From Name
              </label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Support"
              />
            </div>

            {formData.provider === 'SMTP' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      id="smtpHost"
                      name="smtpHost"
                      required={formData.provider === 'SMTP'}
                      value={formData.smtpHost}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port *
                    </label>
                    <input
                      type="number"
                      id="smtpPort"
                      name="smtpPort"
                      required={formData.provider === 'SMTP'}
                      min="1"
                      max="65535"
                      value={formData.smtpPort}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      id="smtpUsername"
                      name="smtpUsername"
                      value={formData.smtpUsername}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="username@gmail.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      id="smtpPassword"
                      name="smtpPassword"
                      value={formData.smtpPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="app-password"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    name="smtpSecure"
                    checked={formData.smtpSecure}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smtpSecure" className="ml-2 block text-sm text-gray-900">
                    Use secure connection (TLS/SSL)
                  </label>
                </div>
              </div>
            )}

            {formData.provider === 'RESEND' && (
              <div>
                <label htmlFor="resendApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Resend API Key *
                </label>
                <input
                  type="password"
                  id="resendApiKey"
                  name="resendApiKey"
                  required={formData.provider === 'RESEND'}
                  value={formData.resendApiKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="re_AbCdEfGh_123456789"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Set as active configuration
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {config && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                loading={creating}
              >
                {config ? 'Update' : 'Save'} Configuration
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}