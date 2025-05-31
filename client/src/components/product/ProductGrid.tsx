import React from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "./SkeletonCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  stockLevel: number;
  isNew?: boolean;
};

type ProductGridProps = {
  products: Product[];
  loading: boolean;
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      {loading &&
        Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
    </div>
  );
};

export default ProductGrid; 