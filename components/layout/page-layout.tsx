/**
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import ScrollToTopButton from "@/components/ui/scroll-to-top-button"
import { cn } from "@/lib/utils/cn"

interface PageLayoutProps {
  children: ReactNode
  searchTerm?: string
  onSearchChange?: (value: string) => void
  cartItemCount?: number
  className?: string
  showScrollToTop?: boolean
}

export default function PageLayout({
  children,
  searchTerm,
  onSearchChange,
  cartItemCount,
  className,
  showScrollToTop = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header searchTerm={searchTerm} onSearchChange={onSearchChange} cartItemCount={cartItemCount} />

      <main className={cn("flex-1", className)}>{children}</main>

      <Footer />

      {showScrollToTop && <ScrollToTopButton />}
    </div>
  )
}
