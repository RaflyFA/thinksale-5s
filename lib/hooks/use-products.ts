import { useQuery } from '@tanstack/react-query'
import { 
  fetchProducts,
  fetchFeaturedProducts,
  fetchBestSellerProducts,
  fetchTopRatedProducts,
  fetchInStockProducts,
  searchProducts,
  fetchProductDetail
} from '../services/product-service'
import type { Product } from '../types'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBestSellerProducts() {
  return useQuery({
    queryKey: ['products', 'best-seller'],
    queryFn: fetchBestSellerProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTopRatedProducts() {
  return useQuery({
    queryKey: ['products', 'top-rated'],
    queryFn: fetchTopRatedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useInStockProducts() {
  return useQuery({
    queryKey: ['products', 'in-stock'],
    queryFn: fetchInStockProducts,
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
      return fetchProductDetail(productId);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 