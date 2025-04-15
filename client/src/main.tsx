import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Your context provider (replace with correct import if needed)
import MyContextProvider from "./MyContextProvider";
import { WishlistProvider } from "./context/WishlistContext"; // if needed
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext"; // if needed
import { CartProvider } from "./context/CartContext";
import { useCart } from './context/CartContext';

// Remove unused component until needed

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// ✅ Single root render with all providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MyContextProvider>
        <CartProvider> {/* ✅ MUST wrap App */}
          <WishlistProvider>
            <RecentlyViewedProvider>
              <App />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </MyContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

