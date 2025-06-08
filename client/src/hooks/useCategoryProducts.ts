// client/src/hooks/useCategoryProducts.ts
import { useQuery } from '@tanstack/react-query'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface Product {
  id: string
  name: string
  price: number
}

export const fetchCategoryProducts = async (categoryId: string): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}/products`);
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
