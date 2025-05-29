import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, startTransition } from "react";
import ProductCard from "../components/product/ProductCard";
import FeaturedProductShowcase from "../components/product/FeaturedProductShowcase";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { Product } from "../types/product";
import { mapStockLevelToStatus } from "../types/product";
import React from "react";

const PAGE_SIZE = 8;

export default function NewArrivals() {
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery<Product[]>({
    queryKey: ["/api/products/new"],
    queryFn: async () => {
      const res = await fetch("/api/products/new");
      if (!res.ok) throw new Error("Failed to fetch new products");
      return res.json();
    },
  });

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const productsCopy = [...products];

    switch (sortBy) {
      case "price-low-high":
        return productsCopy.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case "price-high-low":
        return productsCopy.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case "name-a-z":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "discount":
        return productsCopy.sort((a, b) => {
          const aDiscount = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
          const bDiscount = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
          return bDiscount - aDiscount;
        });
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">New Arrivals</h1>
        <p className="text-gray-600">
          Check out our newest products just added to our store
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Select
          value={sortBy}
          onValueChange={(value) => {
            startTransition(() => {
              setSortBy(value);
              setCurrentPage(1);
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Featured</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            <SelectItem value="name-a-z">Name: A to Z</SelectItem>
            <SelectItem value="name-z-a">Name: Z to A</SelectItem>
            <SelectItem value="discount">Biggest Discount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-[4/3]">
              <Skeleton className="w-full h-full rounded-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <>
          <FeaturedProductShowcase
            product={{
              ...sortedProducts[0],
              id: Number(sortedProducts[0].id),
              imageUrl: sortedProducts[0].image,
              discountPrice: sortedProducts[0].discountPrice ?? null,
              stockLevel: mapStockLevelToStatus(sortedProducts[0].stockLevel),
              description:
                sortedProducts[0].description ||
                "Be among the first to experience this brand new addition to our collection. Just arrived and already turning heads!",
            }}
            properties={[
              { name: "Release Date", value: "New This Week" },
              { name: "Available In Store", value: "Yes" },
              { name: "Collection", value: "Spring 2025" },
              { name: "Limited Edition", value: "Yes" },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={String(product.id)}
                slug={product.slug}
                name={product.name}
                imageUrl={product.image}
                price={product.price}
                discountPrice={product.discountPrice ?? undefined}
                stockLevel={product.stockLevel}
                isNew={product.isNew ?? true}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(sortedProducts.length / PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No new products found</h3>
          <p className="text-gray-600">
            Check back soon for our newest arrivals!
          </p>
        </div>
      )}
    </div>
  );
}
