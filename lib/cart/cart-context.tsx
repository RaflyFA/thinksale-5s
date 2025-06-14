"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"

interface CartItem {
  product: Product
  ram: string
  ssd: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string, ram: string, ssd: string) => void
  updateQuantity: (productId: string, ram: string, ssd: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever items change
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === newItem.product.id && item.ram === newItem.ram && item.ssd === newItem.ssd,
      )

      if (existingItemIndex > -1) {
        // Item already exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // New item, add to cart
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (productId: string, ram: string, ssd: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.ram === ram && item.ssd === ssd)),
    )
  }

  const updateQuantity = (productId: string, ram: string, ssd: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, ram, ssd)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.ram === ram && item.ssd === ssd ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
