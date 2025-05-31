// src/pages/SearchPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/products?q=${query}`);
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };

    if (query) fetchData();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for "{query}"
      </h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default SearchPage;
