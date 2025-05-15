// client/src/hooks/useCategoryProducts.ts
import { useQuery } from '@tanstack/react-query'

export interface Product {
  id: string
  name: string
  price: number
}

export const fetchCategoryProducts = async (categoryId: string): Promise<Product[]> => {
  const res = await fetch(`/api/categories/${categoryId}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ['categoryProducts', categoryId],
    queryFn: () => fetchCategoryProducts(categoryId),
    enabled: !!categoryId,
  })
}
