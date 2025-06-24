"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Package2,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

import { LoadingState } from "@/components/admin/shared/loading-state"
import { StatusBadge } from "@/components/admin/shared/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils/admin-helpers"
import type { DashboardStats, LoadingState as LoadingStateType } from "@/lib/types/admin"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingStateType>({
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Invalid response format from server')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setLoadingState({ isLoading: false, error: errorMessage })
      toast.error('Failed to load dashboard data')
    } finally {
      setLoadingState({ isLoading: false, error: null })
    }
  }

  // Show loading or error state
  if (loadingState.isLoading || loadingState.error || !stats) {
    return (
      <LoadingState
        isLoading={loadingState.isLoading}
        error={loadingState.error}
        onRetry={fetchDashboardStats}
        loadingText="Loading dashboard..."
        errorText="Failed to load dashboard data"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store's performance and recent activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total from all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Available products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total orders received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Total inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items needing attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions from your store
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No orders yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.order_number}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.payment_status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common admin tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/products/new">
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/products">
                <Package2 className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/stock">
                <Package2 className="mr-2 h-4 w-4" />
                Manage Stock
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/orders">
                <CreditCard className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {stats.stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Stock Alerts
            </CardTitle>
            <CardDescription>
              Items that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.stockAlerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.product_name}</p>
                    {alert.variant_info && (
                      <p className="text-xs text-muted-foreground">
                        {alert.variant_info}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-600">
                      {alert.quantity} left
                    </p>
                    <Badge
                      variant={alert.alert_level === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.alert_level === 'critical' ? 'Critical' : 'Low Stock'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {stats.stockAlerts.length > 6 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/stock">
                    View All Alerts ({stats.stockAlerts.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 