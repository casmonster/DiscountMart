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
// ... imports unchanged
import debounce from "lodash.debounce";


const baseUrl = import.meta.env.VITE_API_BASE_URL;


const PAGE_SIZE = 8;
export default function NewArrivals() {
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["new-products"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/products/new`);
      if (!res.ok) throw new Error("Failed to fetch new products");
      return res.json();
    },
  });
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    const sorted = [...products];
    switch (sortBy) {
      case "price-low-high":
        return sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case "price-high-low":
        return sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case "name-a-z":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "discount":
        return sorted.sort((a, b) => {
          const aDiscount = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
          const bDiscount = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
          return bDiscount - aDiscount;
        });
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const handleSortChange = debounce((value: string) => {
    startTransition(() => {
      setSortBy(value);
      setCurrentPage(1);
    });
  }, 150);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">New Arrivals</h1>
        <p className="text-gray-600">Check out our newest products just added to our store</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Select value={sortBy} onValueChange={handleSortChange}>
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <Skeleton key={idx} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <>
          {/* Keep your FeaturedProductShowcase as-is */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={String(product.id)}
                id={Number(product.id)}
                slug={product.slug}
                name={product.name}
                imageUrl={product.imageUrl ?? ''}
                price={product.price}
                discountPrice={product.discountPrice ?? null}
                stockLevel={Number(product.stockLevel)}
                isNew={product.isNew ?? true}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(sortedProducts.length / PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded transition ${
                  page === currentPage ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No new products found</h3>
          <p className="text-gray-600">Check back soon for our newest arrivals!</p>
        </div>
      )}
    </div>
  );
}


