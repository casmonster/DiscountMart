import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Spinner from "./components/ui/spinner";
// Static pages
import Category from "./pages/Category";
import NotFound from "./pages/not-found";
import ProductDetail from "./pages/ProductDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import StoreInfo from "./pages/StoreInfo";
import Wishlist from "./pages/Wishlist";
import NewArrivals from "./pages/NewArrivals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PickupPolicy from "./pages/PickupPolicy";
import Testimonials from "./pages/Testimonials";
import SearchPage from "./pages/SearchPage";
// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/store-info" element={<StoreInfo />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/clearance/:slug" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pickup-policy" element={<PickupPolicy />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/testimonials" element={<Testimonials/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
function App() {
  return (
    <Suspense fallback={<Spinner color="border-purple-600" label="Loading content..." responsive />}>
      <AppRoutes />
    </Suspense>
  );
}
export default App;
