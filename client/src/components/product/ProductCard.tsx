import React from "react";
import { Link } from "react-router-dom";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  stockLevel: number;
  isNew?: boolean;
};

export default function ProductCard({
  id,
  slug,
  name,
  imageUrl,
  price,
  discountPrice,
  stockLevel,
  isNew = false,
}: ProductCardProps) {
  const displayPrice = discountPrice ?? price;
  const isInStock = stockLevel > 0;

  return (
    <Link
      to={`/product/${slug}`}
      className="block group bg-white shadow hover:shadow-lg rounded-lg overflow-hidden transition duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>

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

        <div className="mt-1 text-sm text-gray-500">
          {isInStock ? `${stockLevel} in stock` : "Out of stock"}
          {isNew && <span className="ml-2 text-green-600 font-medium">New</span>}
        </div>
      </div>
    </Link>
  );
}
