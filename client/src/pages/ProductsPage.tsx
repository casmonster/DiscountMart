import React, { useEffect, useRef, useState, useCallback } from "react";
import ProductGrid from "../components/product/ProductGrid";

type Product = {
  id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  stockLevel: number;
  // Add other fields as needed
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/products?page=${page}&limit=12`);
    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    setHasMore(data.products.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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