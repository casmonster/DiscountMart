"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import ProductCard from "../../components/product/ProductCard";
import { demoProducts } from "../../../../server/storage";
import type { Product } from "../../../../server/storage";
import debounce from "lodash.debounce";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [search, setSearch] = useState(queryParam);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(queryParam);
    inputRef.current?.focus(); // Autofocus input
  }, [queryParam]);

  // Debounced URL update
  const updateQuery = useMemo(
    () =>
      debounce((query: string) => {
        const trimmed = query.trim();
        router.push(`/products${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""}`);
      }, 400),
    [router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateQuery(val);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const filteredProducts = search
    ? demoProducts.filter((product: Product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : demoProducts;

  return (
    <div className="px-4 py-8">
      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              slug={product.slug}
              imageUrl={product.imageUrl}
              price={product.price}
              discountPrice={product.discountPrice ?? undefined}
              stockLevel={product.stockLevel}
              isNew={product.isNew}
              // Name with highlight applied
              name={
                typeof product.name === "string"
                  ? highlightMatch(product.name, search)
                  : product.name
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
