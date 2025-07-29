import React, { use } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useOrganizationStore } from '@/store/organization.store';
import { useAuthStore } from '@/lib/nexcom/auth/stores/auth-store';


export function Header() {

    const currentOrganization = useOrganizationStore((state) => state.currentOrganization)
    const user = useAuthStore((state) => state.user)
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
            <span className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{currentOrganization?.name}</span>
              </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button title='Notifications' className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{user?.name ?? user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}