import { Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { useEffect } from "react";


function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
 // Added ScrollRestoration

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
 import Checkout from "./pages/Checkout";
 import OrderConfirmation from "./pages/OrderConfirmation";
 import StoreInfo from "./pages/StoreInfo";
import Wishlist from "./pages/Wishlist";
import NewArrivals from "./pages/NewArrivals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PickupPolicy from "./pages/PickupPolicy";

// Removed unused imports and components

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category params={{
            slug: ""
          }} />} />
          <Route path="/product/:slug" element={<ProductDetail params={{
            slug: ""
          }} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation params={{
            id: ""
          }} />} />
          <Route path="/store-info" element={<StoreInfo />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pickup-policy" element={<PickupPolicy />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <Router />
            <Toaster />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;

