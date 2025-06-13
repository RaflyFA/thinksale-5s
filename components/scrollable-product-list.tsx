// components/scrollable-product-list.tsx
"use client"

import { useRef, useEffect } from "react"
import type { Product } from "@/lib/types"
import ProductCard from "./product-card"

interface ScrollableProductListProps {
  products: Product[]
  id?: string
}

export default function ScrollableProductList({ products, id }: ScrollableProductListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let isDown = false
    let startX: number
    let scrollLeft: number

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true
      scrollContainer.style.cursor = "grabbing"
      
      startX = e.pageX - scrollContainer.offsetLeft
      scrollLeft = scrollContainer.scrollLeft
    }

    const handleMouseLeave = () => {
      isDown = false
      scrollContainer.style.cursor = "grab"
    }

    const handleMouseUp = () => {
      isDown = false
      scrollContainer.style.cursor = "grab"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - scrollContainer.offsetLeft
      const walk = (x - startX) * 1.5
      scrollContainer.scrollLeft = scrollLeft - walk
    }

    // Touch events dengan smooth animation
    const handleTouchStart = (e: TouchEvent) => {
      
      startX = e.touches[0].pageX - scrollContainer.offsetLeft
      scrollLeft = scrollContainer.scrollLeft
    }

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - scrollContainer.offsetLeft
      const walk = (x - startX) * 1.5
      scrollContainer.scrollLeft = scrollLeft - walk
    }

    const handleTouchEnd = () => {
      
    }

    // Event listeners
    scrollContainer.addEventListener("mousedown", handleMouseDown)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)
    scrollContainer.addEventListener("mouseup", handleMouseUp)
    scrollContainer.addEventListener("mousemove", handleMouseMove)
    scrollContainer.addEventListener("touchstart", handleTouchStart)
    scrollContainer.addEventListener("touchmove", handleTouchMove)
    scrollContainer.addEventListener("touchend", handleTouchEnd)

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
      scrollContainer.removeEventListener("mouseup", handleMouseUp)
      scrollContainer.removeEventListener("mousemove", handleMouseMove)
      scrollContainer.removeEventListener("touchstart", handleTouchStart)
      scrollContainer.removeEventListener("touchmove", handleTouchMove)
      scrollContainer.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
  <div
    id={id}
    ref={scrollRef}
    className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory cursor-grab select-none scroll-smooth"
  >
    {products.map((product) => (
      <div
        key={product.id}
        className="min-w-28 w-44 h-80 flex-shrink-0 snap-start transition-transform duration-200 hover:scale-100"
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
)

}
