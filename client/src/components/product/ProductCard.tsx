// src/components/ProductCard.tsx

import React, { memo, useMemo, ReactNode } from "react";
import { Link } from "react-router-dom";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string | ReactNode; // 🔄 Allow string or ReactNode
  imageUrl: string;
  price: number;
  discountPrice?: number;
  stockLevel: number;
  isNew?: boolean;
};

function ProductCardComponent({
  id,
  slug,
  name,
  imageUrl,
  price,
  discountPrice,
  stockLevel,
  isNew = false,
}: ProductCardProps) {
  const displayPrice = useMemo(() => discountPrice ?? price, [discountPrice, price]);
  const isInStock = stockLevel > 0;

  const nameTextOnly = typeof name === "string" ? name : "Product";

  return (
    <Link
      to={`/product/${slug}`}
      className="block group bg-white shadow hover:shadow-lg rounded-lg overflow-hidden transition duration-300"
      aria-label={`View details for product: ${nameTextOnly}`}
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Image of ${nameTextOnly}`}
          loading="lazy"
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          fetchPriority="low"
          onError={(e) => {
            e.currentTarget.src = "/fallback.jpg";
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {name} {/* 🔄 Supports highlighted search matches */}
        </h3>

        <div className="flex items-center space-x-2">
          {discountPrice !== undefined ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
              <span className="text-base text-red-500 font-semibold">
                ${discountPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base text-gray-900 font-semibold">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-1 text-sm text-gray-500 min-h-[1.5rem]">
          {isInStock ? `${stockLevel} in stock` : "Out of stock"}
          {isNew && (
            <span className="ml-2 text-green-600 font-medium">New</span>
          )}
        </div>
      </div>
    </Link>
  );
}

const ProductCard = memo(ProductCardComponent);
export default ProductCard;
