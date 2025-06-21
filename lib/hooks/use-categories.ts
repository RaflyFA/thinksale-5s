import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/category-service'
import type { Category } from '../types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
} 