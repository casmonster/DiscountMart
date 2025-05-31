import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { v4 as uuidv4 } from "uuid";

export type CartItemWithProduct = {
  id: number;
  cartId: string;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    stockLevel: string;
  };
};

type CartError = { message: string; code?: string };

interface CartContextType {
  cartItems: CartItemWithProduct[];
  cartId: string;
  isLoading: boolean;
  isInitialized: boolean;
  error: CartError | null;
  itemCount: number;
  getCartTotal: () => number;
  getTaxAmount: () => number;
  getFinalTotal: () => number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  resetError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [cartId, setCartId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<CartError | null>(null);

  const resetError = useCallback(() => setError(null), []);

  // Cart ID initialization
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      setCartId(storedCartId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("cartId", newId);
      setCartId(newId);
    }
  }, []);

  // Fetch cart items when cartId is ready
  useEffect(() => {
    if (cartId) fetchCartItems();
  }, [cartId]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/${cartId}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setCartItems(data);
      setIsInitialized(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch cart";
      setError({ message });
      toast({ title: "Error", description: message, type: "background" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateQuantity = (qty: number) => {
    if (qty < 0) throw new Error("Quantity cannot be negative");
    if (qty > 99) throw new Error("Quantity cannot exceed 99");
  };

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    try {
      setIsLoading(true);
      validateQuantity(quantity);
      await apiRequest("POST", "/api/cart", { cartId, productId, quantity });
      await fetchCartItems();
      toast({ title: "Added to cart", description: "Item added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add item", type: "background" });
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) return removeItem(itemId);
    try {
      setIsLoading(true);
      await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      await fetchCartItems();
    } catch {
      toast({ title: "Error", description: "Failed to update quantity", type: "background" });
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      await fetchCartItems();
      toast({ title: "Removed from cart", description: "Item removed successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to remove item", type: "background" });
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/cart/clear/${cartId}`);
      setCartItems([]);
    } catch {
      toast({ title: "Error", description: "Failed to clear cart", type: "background" });
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getTaxAmount = useCallback(() => getCartTotal() * 0.1, [getCartTotal]);
  const getFinalTotal = useCallback(() => getCartTotal() + getTaxAmount(), [getCartTotal, getTaxAmount]);

  const value = useMemo(
    () => ({
      cartItems,
      cartId,
      isLoading,
      isInitialized,
      error,
      itemCount,
      getCartTotal,
      getTaxAmount,
      getFinalTotal,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      resetError,
    }),
    [cartItems, cartId, isLoading, isInitialized, error, itemCount, getCartTotal, getTaxAmount, getFinalTotal, addToCart, updateQuantity, removeItem, clearCart, resetError]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
