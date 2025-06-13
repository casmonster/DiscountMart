import React, { useEffect, useRef, useState, useCallback } from "react";
import ProductGrid from "../components/product/ProductGrid";
import type { Product } from "../types/product";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;



const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/products?page=${page}&limit=12`);
      if (!res.ok) throw new Error("Failed to load products.");
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.products.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <ProductGrid products={products} loading={loading} />
      <div ref={lastProductRef} className="h-1"></div>
    </div>
  );
};

export default ProductsPage;
