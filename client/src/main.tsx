import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from './components/ErrorBoundary';

// Your context provider (replace with correct import if needed)
import MyContextProvider from "./MyContextProvider";
import { WishlistProvider } from "./context/WishlistContext"; // if needed
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext"; // if needed
import { CartProvider } from "./context/CartContext";

// Remove unused component until needed

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// ✅ Single root render with all providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <MyContextProvider>
        <CartProvider> 
          <WishlistProvider>
            <RecentlyViewedProvider>
              <App />
              <Toaster />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </MyContextProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

