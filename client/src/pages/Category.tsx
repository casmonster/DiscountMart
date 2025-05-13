import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Category as CategoryType } from "../types/category";
import { ProductPropertyType, ProductProperty } from "../types/product";

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

function getCategoryProperties(categorySlug: string, product: any): ProductProperty[] {
  const properties: ProductProperty[] = [];

  switch (categorySlug) {
    case "clothing":
      properties.push(
        { name: "Size", value: "Medium", type: "size" },
        { name: "Color", value: "Navy Blue", type: "color" },
        { name: "Material", value: "Cotton Blend", type: "material" },
        { name: "Style", value: "Casual", type: "default" }
      );
      break;
    case "tableware":
      properties.push(
        { name: "Material", value: "Ceramic", type: "material" },
        { name: "Dimensions", value: '10" x 10"', type: "default" },
        { name: "Dishwasher Safe", value: "Yes", type: "default" },
        { name: "Set Size", value: "4 pieces", type: "default" }
      );
      break;
    case "kitchen":
      properties.push(
        { name: "Material", value: "Stainless Steel", type: "material" },
        { name: "Dimensions", value: '12" x 8" x 4"', type: "default" },
        { name: "Dishwasher Safe", value: "Yes", type: "default" },
        { name: "Heat Resistant", value: "Up to 450°F", type: "default" }
      );
      break;
    case "home-decor":
      properties.push(
        { name: "Material", value: "Ceramic & Wood", type: "material" },
        { name: "Dimensions", value: '8" x 6" x 10"', type: "default" },
        { name: "Color", value: "Beige", type: "color" },
        { name: "Style", value: "Modern Minimalist", type: "default" }
      );
      break;
    default:
      properties.push(
        { name: "Condition", value: "New", type: "default" },
        { name: "In Store", value: "Available", type: "default" }
      );
  }

  return properties;
}

export default function Category({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<string>("default");

  const categoryQuery = useQuery<CategoryType, Error>({
    queryKey: [`/api/categories/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      return res.json();
    },
  });

  useEffect(() => {
    if (categoryQuery.isError) {
      console.error("Error loading category:", categoryQuery.error);
    }
  }, [categoryQuery.isError]);

  const category = categoryQuery.data;
  const categoryLoading = categoryQuery.isLoading;

  const productsQuery = useQuery({
    queryKey: [`/api/products/category/${category?.id}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/category/${category?.id}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!category?.id,
  });

  const products = productsQuery.data;
  const productsLoading = productsQuery.isLoading;

  useEffect(() => {
    if (productsQuery.isError) {
      console.error("Error loading category products:", productsQuery.error);
    }
  }, [productsQuery.isError]);

  useEffect(() => {
    if (category === null) {
      navigate("/not-found");
    }
  }, [category, navigate]);

  const getSortedProducts = () => {
    if (!products) return [];

    const productsCopy = [...products];

    switch (sortBy) {
      case "price-low-high":
        return productsCopy.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
      case "price-high-low":
        return productsCopy.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
      case "name-a-z":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "discount":
        return productsCopy.sort((a, b) => {
          const aDiscount = a.discountPrice
            ? (a.price - a.discountPrice) / a.price
            : 0;
          const bDiscount = b.discountPrice
            ? (b.price - b.discountPrice) / b.price
            : 0;
          return bDiscount - aDiscount;
        });
      default:
        return productsCopy;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {categoryLoading ? (
        <div className="mb-6">
          <Skeleton className="h-10 w-1/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
          <p className="text-gray-600">
            Browse our collection of {category?.name?.toLowerCase()}
          </p>
        </div>
      )}

      <div className="flex justify-end mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
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
          {Array(8)
            .fill(0)
            .map((_, i) => (
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
          {slug && sortedProducts.length > 0 && (
            <FeaturedProductShowcase
              product={{
                ...sortedProducts[0],
                description:
                  sortedProducts[0].description ||
                  "Experience quality and style with this premium item from our collection.",
              }}
              properties={getCategoryProperties(slug, sortedProducts[0])}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.price}
                discountPrice={product.discountPrice}
                stockLevel={product.stockLevel}
                isNew={product.isNew}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-600">
            We couldn't find any products in this category.
          </p>
        </div>
      )}
    </div>
  );
}
