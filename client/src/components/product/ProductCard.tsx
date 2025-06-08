// src/components/ProductCard.tsx

import React, { memo, useMemo, ReactNode } from "react";
import { Link } from "react-router-dom";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string | ReactNode;
  imageUrl: string;
  price: number | null; // allow null from backend
  discountPrice?: number | null;
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
  const displayPrice = useMemo(
    () => (typeof discountPrice === "number" ? discountPrice : price),
    [discountPrice, price]
  );

  const isInStock = stockLevel > 0;
  const nameTextOnly = typeof name === "string" ? name : "Product";

  const formattedPrice = (value: number | null | undefined) =>
    typeof value === "number"
      ? value.toLocaleString("en-RW", {
          style: "currency",
          currency: "RWF",
          minimumFractionDigits: 0,
        })
      : "Price unavailable";

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
          fetchPriority="high" 
          onError={(e) => {
            e.currentTarget.src = "/fallback.jpg";
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>

        <div className="flex items-center space-x-2">
          {discountPrice !== undefined && discountPrice !== null ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formattedPrice(price)}
              </span>
              <span className="text-base text-red-500 font-semibold">
                {formattedPrice(discountPrice)}
              </span>
            </>
          ) : (
            <span className="text-base text-gray-900 font-semibold">
              {formattedPrice(price)}
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
