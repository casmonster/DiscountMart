import {
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  cartItems, CartItem, InsertCartItem,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
} from "./schema.js"; // Added .js extension

import { DatabaseStorage } from "./db-storage.js"; // Import DatabaseStorage

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;

  getCartItems(cartId: string): Promise<(CartItem & { product: Product })[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(cartId: string): Promise<void>;

  placeOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
   updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
   deleteOrder(id: number): Promise<boolean>;
  getAllOrders(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;

}

// Remove MemStorage class and its methods
// export class MemStorage implements IStorage { ... }

// ----------- Singleton Instance -----------
export const storage = new DatabaseStorage(); // Use DatabaseStorage

// ----------- Global Async API Exports -----------

// Categories
export const getCategories = async () => storage.getCategories();
export const getCategoryBySlug = async (slug: string) => storage.getCategoryBySlug(slug);

// Products
export const getProducts = async () => storage.getProducts();
export const getProductsByCategory = async (categoryId: number) => storage.getProductsByCategory(categoryId);
export const getProductBySlug = async (slug: string) => storage.getProductBySlug(slug);
export const getProductById = async (id: number) => storage.getProductById(id);
export const searchProducts = async (query: string) => storage.searchProducts(query);
export const getFeaturedProducts = async () => storage.getFeaturedProducts();
export const getNewProducts = async ( ) => storage.getNewProducts();

// Cart
export const getCartItems = async (cartId: string) => storage.getCartItems(cartId);
export const addCartItem = async (item: InsertCartItem) => storage.addCartItem(item);
export const updateCartItemQuantity = async (id: number, quantity: number) => storage.updateCartItemQuantity(id, quantity);
export const removeCartItem = async (id: number) => storage.removeCartItem(id);

export const clearCart = async (cartId: string) => storage.clearCart(cartId);


// Orders
export const placeOrder = async (order: InsertOrder, items: InsertOrderItem[]) => storage.placeOrder(order, items);
export const getOrder = async (id: number) => storage.getOrder(id);
