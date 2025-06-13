'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@components/product/ProductCard';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${slug}`);
        const { category } = await res.json();

        const productsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        const allProducts: Product[] = await productsRes.json();

        const filtered = allProducts.filter(
          (product) => product.categoryId === category.id
        );

        setCategory(category);
        setProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch category or products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryAndProducts();
  }, [slug]);

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {category ? category.name : 'Category'}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={Number(product.id)}
              id={product.id}
              slug={product.slug}
              name={product.name}
              imageUrl={product.imageUrl}
              
              price={product.price}
              discountPrice={product.discountPrice ?? undefined}
              stockLevel={product.stockLevel}
              isNew={product.isNew}
              description={product.description ?? ''}
              categoryId={product.categoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
