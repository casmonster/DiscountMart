import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type WishlistItem = {
  id: number;
  slug: string;
  name: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number | null ;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: WishlistItem) => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        } else {
          console.warn("Invalid wishlist format in localStorage");
          localStorage.removeItem("wishlist");
        }
      }
    } catch (err) {
      console.error("Failed to load wishlist from localStorage", err);
      localStorage.removeItem("wishlist");
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    } catch (err) {
      console.error("Failed to save wishlist to localStorage", err);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productId: number) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const addToWishlist = useCallback((product: WishlistItem) => {
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id) ? prev : [...prev, product]
    );
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: WishlistItem) => {
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = useMemo(
    () => ({
      wishlistItems,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlistCount,
    }),
    [wishlistItems, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, wishlistCount]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
