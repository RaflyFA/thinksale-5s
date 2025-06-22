"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import EnhancedProductCard from "./enhanced-product-card"
import type { Product } from "@/lib/types"

interface ScrollableProductListProps {
  products: Product[]
  id?: string
}

export default function ScrollableProductList({ products, id }: ScrollableProductListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  
  const [isDragging, setIsDragging] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPosition, setScrollLeftPosition] = useState(0)

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition()
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [products])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsMouseDown(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftPosition(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = x - startX
    if (Math.abs(walk) > 3) { // Threshold to start dragging
        setIsDragging(true)
    }
    if (isDragging) {
        scrollContainerRef.current.scrollLeft = scrollLeftPosition - walk
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
    setTimeout(() => {
        setIsDragging(false)
    }, 0);
  }

  const handleMouseLeave = () => {
    setIsMouseDown(false)
    setIsDragging(false)
  }

  // Touch handlers remain the same as they don't have this click/drag issue
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftPosition(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeftPosition - walk
  }

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="relative" id={id}>
      {/* Arrows (no changes needed) */}
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
          onClick={handleScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
          onClick={handleScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: isMouseDown ? "grabbing" : "grab"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 snap-start"
            style={{ pointerEvents: isDragging ? "none" : "auto" }}
          >
            <EnhancedProductCard
              product={product}
              showAddToCart={true}
              showWishlist={true}
            />
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 