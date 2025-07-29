"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Database, Shield, Bell, Palette } from 'lucide-react';
import { useToast } from '@/components/UI/Toast';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { useOrganizationStore } from '@/store/organization.store';


export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const { showSuccess } = useToast();

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'data', name: 'Data & Privacy', icon: Database }
  ];

  const handleSaveSettings = () => {
    showSuccess('Settings Saved', 'Your settings have been successfully updated');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Currency
                  </label>
                  <select title='Currency' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="XOF">XOF - West African CFA Franc</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select title='Language' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select title='Timezone' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="secondary" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Session Management</h4>
                    <p className="text-sm text-gray-600">Manage active sessions and devices</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { name: 'Invoice Created', description: 'Get notified when new invoices are created' },
                  { name: 'Payment Received', description: 'Get notified when payments are received' },
                  { name: 'Invoice Overdue', description: 'Get notified when invoices become overdue' },
                  { name: 'New Team Member', description: 'Get notified when someone joins your organization' }
                ].map((notification) => (
                  <div key={notification.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.name}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <input
                        title='Notifications'
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Light', 'Dark', 'Auto'].map((theme) => (
                  <div key={theme} className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <div className={`w-16 h-12 mx-auto mb-2 rounded ${
                        theme === 'Light' ? 'bg-white border' : 
                        theme === 'Dark' ? 'bg-gray-900' : 'bg-gradient-to-r from-white to-gray-900'
                      }`}></div>
                      <p className="font-medium text-gray-900">{theme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Primary', color: '#3B82F6' },
                  { name: 'Secondary', color: '#6B7280' },
                  { name: 'Success', color: '#10B981' },
                  { name: 'Warning', color: '#F59E0B' }
                ].map((colorOption) => (
                  <div key={colorOption.name} className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto mb-2 rounded-lg border cursor-pointer"
                      style={{ backgroundColor: colorOption.color }}
                    ></div>
                    <p className="text-sm font-medium text-gray-900">{colorOption.name}</p>
                    <p className="text-xs text-gray-600">{colorOption.color}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Keep your API keys secure</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Never share your API keys publicly or commit them to version control.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Production API Key</h4>
                    <p className="text-sm text-gray-600 font-mono">sk_prod_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">Regenerate</Button>
                    <Button variant="secondary" size="sm">Copy</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Test API Key</h4>
                    <p className="text-sm text-gray-600 font-mono">sk_test_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">Regenerate</Button>
                    <Button variant="secondary" size="sm">Copy</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Export Data</h4>
                    <p className="text-sm text-gray-600">Download all your organization data</p>
                  </div>
                  <Button variant="secondary" size="sm">Export</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Organization</h4>
                    <p className="text-sm text-red-700">Permanently delete this organization and all data</p>
                  </div>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your organization preferences and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1">
          <Card>
            <div className="p-6">
              {renderTabContent()}
              
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <Button onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}