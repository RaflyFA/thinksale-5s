import { useQuery } from '@tanstack/react-query'
import { getProducts, getFeaturedProducts, getBestSellerProducts, getTopRatedProducts, getInStockProducts, searchProducts, getProductById } from '../services/product-service'
import type { Product } from '../types'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBestSellerProducts() {
  return useQuery({
    queryKey: ['products', 'best-seller'],
    queryFn: getBestSellerProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTopRatedProducts() {
  return useQuery({
    queryKey: ['products', 'top-rated'],
    queryFn: getTopRatedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useInStockProducts() {
  return useQuery({
    queryKey: ['products', 'in-stock'],
    queryFn: getInStockProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter cache for stock info)
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProductById(productId: string | null) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => {
      if (!productId) return null;
      return getProductById(productId);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 