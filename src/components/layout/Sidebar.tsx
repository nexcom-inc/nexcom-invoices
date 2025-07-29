import React from 'react';
import { 
  Users, 
  Package, 
  FileText, 
  Settings, 
  Calculator,
  Mail,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { useOrganizationStore } from '@/store/organization.store';
import { usePathname } from 'next/navigation';
import { Link } from '../ui/link';
import Logo from '../app/logo';

const navigation = [
  { url: '', name: 'Dashboard', icon: BarChart3 },
  { url: '/clients', name: 'Clients', icon: Users },
  { url: '/items', name: 'Items', icon: Package },
  { url: '/invoices', name: 'Invoices', icon: FileText },
  { url: '/taxes', name: 'Taxes', icon: Calculator },
  { url: '/mailing', name: 'Mailing', icon: Mail },
  { url: '/invitations', name: 'Invitations', icon: UserPlus },
  { url: '/settings', name: 'Settings', icon: Settings },
];

export function Sidebar() {
const currentOrganization = useOrganizationStore((state) => state.currentOrganization)
const pathname = usePathname()
  return (
    <div className="bg-white shadow-lg w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-end justify-end">
            <Logo className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Invoice</h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const url = `/app/${currentOrganization?.id}${item.url}`
            return (
              <Link
                key={item.name}
                href={item.url}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === url
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}