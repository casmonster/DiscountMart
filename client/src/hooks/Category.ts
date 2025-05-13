import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface Category {
  id: string;
  slug: string;
  // Add other category fields
}

interface Product {
  id: string;
  name: string;
  // Add other product fields
}

// Fully typed custom hook with full options and inferred return types
export function useCategory(
  slug: string,
  options?: UseQueryOptions<Category, Error, Category, [string]>
): UseQueryResult<Category, Error> {
  return useQuery<Category, Error, Category, [string]>({
    queryKey: [`/api/categories/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      return res.json();
    },
    ...options,
  });
}

export function useCategoryProducts(
  categoryId: string | undefined,
  options?: UseQueryOptions<Product[], Error, Product[], [string]>
): UseQueryResult<Product[], Error> {
  return useQuery<Product[], Error, Product[], [string]>({
    queryKey: [`/api/products/category/${categoryId}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/category/${categoryId}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    enabled: !!categoryId, // useful for conditional fetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}
