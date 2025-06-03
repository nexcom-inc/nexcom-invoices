"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    totalItems: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    overdueInvoices: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState<
    { id: string; client: string; amount: number; status: string; date: string }[]
  >([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalInvoices: 156,
      totalClients: 42,
      totalItems: 28,
      pendingInvoices: 12,
      totalRevenue: 125000,
      overdueInvoices: 3,
    });

    setRecentInvoices([
      {
        id: "INV-2025-001",
        client: "Acme Corp",
        amount: 5000,
        status: "PENDING",
        date: "2025-01-15",
      },
      {
        id: "INV-2025-002",
        client: "Tech Solutions",
        amount: 3200,
        status: "PAID",
        date: "2025-01-14",
      },
      {
        id: "INV-2025-003",
        client: "Design Studio",
        amount: 1800,
        status: "OVERDUE",
        date: "2025-01-10",
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Nexcom Invoice
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className="text-gray-500 hover:text-gray-900"
              >
                Invoices
              </Link>
              <Link
                href="/clients"
                className="text-gray-500 hover:text-gray-900"
              >
                Clients
              </Link>
              <Link href="/items" className="text-gray-500 hover:text-gray-900">
                Items
              </Link>
              <Link
                href="/settings"
                className="text-gray-500 hover:text-gray-900"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingInvoices} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">
                Products & services
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/invoices/new">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Button>
              </Link>
              <Link href="/clients/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
              </Link>
              <Link href="/items/new">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your latest invoice activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">
                          {invoice.client}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${invoice.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {invoice.date}
                        </p>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/invoices">
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {stats.overdueInvoices > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">
                    You have {stats.overdueInvoices} overdue invoice
                    {stats.overdueInvoices > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-red-600">
                    Review and follow up on overdue payments to maintain cash
                    flow.
                  </p>
                </div>
                <Link href="/invoices?filter=overdue" className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Review
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
