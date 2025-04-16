import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';

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
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter basename="/DiscountMart">
    <QueryClientProvider client={queryClient}>
      <MyContextProvider>
        <CartProvider> 
          <WishlistProvider>
            <RecentlyViewedProvider>
            <App />
            <Toaster position="bottom-right" />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </MyContextProvider>
    </QueryClientProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

