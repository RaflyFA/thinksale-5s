"use client"

import { useAuth } from "@/lib/auth/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Bell,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  ShieldCheck,
  Shapes,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils/cn"
import React from "react"

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Produk', href: '/admin/products', icon: Package },
  { name: 'Kategori', href: '/admin/categories', icon: Shapes },
  { name: 'Pesanan', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Pengguna', href: '/admin/users', icon: Users },
  { name: 'Analitik', href: '/admin/analytics', icon: LineChart },
]

const settingsNavigation = [
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
]

function NavItem({ item, pathname, isCollapsed }: { item: { name: string, href: string, icon: React.ElementType }, pathname: string, isCollapsed: boolean }) {
  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
  const Icon = item.icon

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.name}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  useEffect(() => {
    try {
      const storedState = localStorage.getItem("sidebar-collapsed")
      if (storedState !== null) {
        setIsCollapsed(JSON.parse(storedState))
      }
    } catch (error) {
      console.error("Failed to parse sidebar state from localStorage", error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const breadcrumbItems = pathname.split('/').filter(Boolean)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/dashboard')
    } else if (!isLoading && user?.role !== 'admin') {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 sm:flex",
        isCollapsed ? "w-14" : "w-60"
      )}>
        <div className={cn("flex h-14 items-center border-b", isCollapsed ? "justify-center" : "px-4")}>
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <ShieldCheck className="h-6 w-6" />
            <span className={cn(isCollapsed && "sr-only")}>ThinkSale</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} isCollapsed={isCollapsed} />
          ))}
        </nav>
        <div className="mt-auto border-t p-2">
          <nav className="space-y-1">
            {settingsNavigation.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>
      </aside>
      <div className={cn(
        "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300",
        isCollapsed ? "sm:pl-14" : "sm:pl-60"
      )}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button
            size="icon"
            variant="outline"
            className="hidden sm:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
               <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="">ThinkSale Admin</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <nav className="grid items-start gap-2 p-4 text-sm font-medium">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActive && "bg-muted text-primary"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
                <div className="mt-auto border-t p-4">
                  <div className="mb-4">
                    {settingsNavigation.map((item) => {
                      const isActive = pathname.startsWith(item.href)
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                           className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActive && "bg-muted text-primary"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.image || ""} alt={user?.name || "Admin"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="font-medium leading-none">{user?.name}</span>
                          <span className="text-xs text-muted-foreground leading-none">{user?.email}</span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]]" align="end">
                       <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Pengaturan</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/')}>Kembali ke Situs</DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard">Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbItems.slice(1).map((item, index) => (
                <React.Fragment key={item || index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 2 ? (
                      <BreadcrumbPage className="capitalize">{item}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={`/${breadcrumbItems.slice(0, index + 2).join('/')}`} className="capitalize">
                          {item}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage src={user?.image || ""} alt={user?.name || "Admin"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Pengaturan</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/')}>Kembali ke Situs</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}