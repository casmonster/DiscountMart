import React from "react";
import   ProductCard from "./ProductCard";
import { Skeleton } from "./SkeletonCard";
import { Product } from "../../types/product";
export type ProductGridProps = {
  products: Product[];
  loading: boolean;
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
        key={String(product.id)} 
        {...product} 
         id={+product.id}
         imageUrl={product.imageUrl || ''}
         discountPrice={product.discountPrice ?? null}
         stockLevel={Number(product.stockLevel) ??   'In Stock'}
        />
      ))}
      {loading &&
        Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
    </div>
  );
};

export default ProductGrid;