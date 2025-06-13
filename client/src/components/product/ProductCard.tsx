import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { CheckCircle, AlertCircle, ShoppingCart, Eye, Heart } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "../../hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import ProductQuickView from "./ProductQuickView";
import { convertToRwandanFrancs, formatRwandanFrancs } from "../../lib/currency";
import type { Product } from "../../types/product";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductCard({
  id,
  slug,
  name,
  imageUrl,
  price,
  discountPrice,
  stockLevel,
  description,
  
  categoryId,
  isNew = false,
}: Product) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toast } = useToast();

  const inWishlist = isInWishlist(Number(id));

  // Normalize stockLevel to string labels
  const normalizedStockLevel =
    typeof stockLevel === "number"
      ? stockLevel === 0
        ? "Out of Stock"
        : stockLevel < 5
        ? "Low Stock"
        : "In Stock"
      : stockLevel;

  const isInStock = normalizedStockLevel === "In Stock";
  const isLowStock = normalizedStockLevel === "Low Stock";

  

  const { data: productDetail } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/products/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch product details");

      const data = await response.json();

      // Normalize stockLevel if it's numeric
      return {
        ...data,
        stockLevel:
          typeof data.stockLevel === "number"
            ? data.stockLevel === 0
              ? "Out of Stock"
              : data.stockLevel < 5
              ? "Low Stock"
              : "In Stock"
            : data.stockLevel,
      };
    },
    enabled: isQuickViewOpen,
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsAdding(true);
      try {
        await addToCart(Number(id), 1);
        toast({
          title: "Added to cart",
          description: `${name} has been added to your cart.`,
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
        });
      } finally {
        setIsAdding(false);
      }
    },
    [addToCart, id, name, toast]
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist({ 
        id:+id,
        slug,
        name,
        imageUrl,
        price,
        discountPrice });
      toast({
        title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: `${name} has been ${inWishlist ? "removed from" : "added to"} your wishlist.`,
      });
    },
    [inWishlist, toggleWishlist, id, slug, name, imageUrl, price, discountPrice, toast]
  );

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
        <div className="block h-full">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Sale tag */}
            {discountPrice && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center">
                <span>{discountPrice}% OFF</span>
              </div>
            )}

            {/* New tag */}
            {isNew && !discountPrice && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center">
                <span>NEW</span>
              </div>
            )}

            {/* Wishlist button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-colors ${
                inWishlist
                  ? "text-secondary hover:text-secondary/80"
                  : "text-gray-600 hover:text-secondary"
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} />
            </Button>

            {/* Overlay with buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 rounded-full shadow-md backdrop-blur-sm bg-white/90 hover:bg-white text-primary hover:text-primary flex items-center justify-center gap-1.5 border-0"
                  onClick={handleQuickView}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Quick View</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isAdding || !isInStock}
                  className="flex-1 rounded-full shadow-md bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-1.5"
                >
                  {isAdding ? (
                    <span className="flex items-center">
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                      Adding...
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Link to={`/product/${slug}`} className="block">
            <div className="p-4 flex flex-col flex-grow">
              {/* Stock status */}
              <div className="mb-1.5">
                {isInStock ? (
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    In Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs text-amber-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Low Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product name */}
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors text-base/tight flex-grow">
                {name}
              </h3>

              {/* Price */}
              <div className="flex items-center mt-2">
                {discountPrice ? (
                  <>
                    <span className="text-blue-800 font-bold mr-2 text-lg">
                      {formatRwandanFrancs(convertToRwandanFrancs(discountPrice))}
                    </span>
                    <span className="text-gray-400 text-sm line-through">
                      {formatRwandanFrancs(convertToRwandanFrancs(price))}
                    </span>
                  </>
                ) : (
                  <span className="text-blue-800 font-bold mr-2 text-lg">
                    {formatRwandanFrancs(convertToRwandanFrancs(price))}
                  </span>
                )}
              </div>

              {/* Status pill */}
              <div className="mt-3">
                {isInStock ? (
                  <span className="inline-block text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    Ready for Pickup
                  </span>
                ) : isLowStock ? (
                  <span className="inline-block text-xs text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
                    Limited Availability
                  </span>
                ) : (
                  <span className="inline-block text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        product={productDetail}
      />
    </>
  );
}
