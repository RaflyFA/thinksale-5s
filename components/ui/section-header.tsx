"use client"

/**
 * Section Header Component
 *
 * Komponen header section yang konsisten
 * Untuk judul dan deskripsi section di seluruh aplikasi
 *
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  children?: ReactNode
  className?: string
  titleClassName?: string
  align?: "left" | "center" | "right"
  
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  action,
  children,
  className,
  titleClassName,
  align = "left",
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right",
  }

  return (
    <div className={cn("mb-8", alignmentClasses[align], className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          {subtitle && <p className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">{subtitle}</p>}

          <h2 className={cn("text-2xl lg:text-3xl font-bold text-gray-900 mb-2", titleClassName)}>{title}</h2>

          {description && <p className={cn("text-gray-600 leading-relaxed text-sm lg:text-xl lg:max-w-2xl", align === "center" ? "mx-auto" : "")}>{description}</p>}
        </div>

        {action && (
          <div className="flex-shrink-0">
            {action.href ? (
              <Button variant="outline" asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button variant="outline" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
