// types/product.ts

export type ProductPropertyType = "size" | "color" | "material" | "default" | "texture";

export type ProductProperty = {
  name: string;
  value: string;
  type?: ProductPropertyType;
};

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stockLevel: number;
  discountPrice?: number;
  discountPercentage?: number;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
  properties?: ProductProperty[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export type FeaturedProduct = {
  product: Product;
  featureText?: string;
};

/**
 * Converts a numerical stock level into a StockStatus string.
 *
 * - 0 or undefined => "Out of Stock"
 * - 1 to 10 => "Low Stock"
 * - > 10 => "In Stock"
 */
export function mapStockLevelToStatus(stockLevel?: number): StockStatus {
  if (stockLevel === undefined || stockLevel === 0) return "Out of Stock";
  if (stockLevel <= 10) return "Low Stock";
  return "In Stock";
}
