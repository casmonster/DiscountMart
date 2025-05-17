import { Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { useEffect } from "react";
import { lazy, Suspense } from 'react';
import RoutesComponent from './LazyRoutes';
import Spinner from './components/ui/spinner';

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
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
 import OrderConfirmation from "./pages/OrderConfirmation";
 import StoreInfo from "./pages/StoreInfo";
import Wishlist from "./pages/Wishlist";
import NewArrivals from "./pages/NewArrivals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PickupPolicy from "./pages/PickupPolicy";



const Home = lazy(() => import('./pages/Home'));
const Checkout = lazy(() => import('./pages/Checkout'));



// Removed unused imports and components

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind</h1>
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
            <RoutesComponent />
            <Toaster />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
<Spinner color="border-purple-600" label="Loading content..." responsive />
export default App;

