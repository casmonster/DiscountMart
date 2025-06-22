// 🚀 Updated: routes.tsx with lazy loading and Suspense wrapper for route-level code-splitting

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Clearance from './pages/Clearance';

// ✅ Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Category = lazy(() => import('./pages/Category'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const PickupPolicy = lazy(() => import('./pages/PickupPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const StoreInfo = lazy(() => import('./pages/StoreInfo'));
const ShippingInfo = lazy(() => import('./pages/ShippingInfo'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/not-found'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const SizeGuide = lazy(() => import('./pages/SizeGuide'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const OrderStatus = lazy(() => import('./pages/OrderStatus'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Newsletter = lazy(() => import('./pages/Newsletter'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const AdminDashBoard = lazy(() => import('./pages/AdminDashBoard'));

const RoutesComponent = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/clearance" element={<Clearance />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/pickup-policy" element={<PickupPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/Search-Page" element={<SearchPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/products/:slug" element={<ProductsPage />} />
        <Route path="/store-info" element={<StoreInfo />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/orders" element={<OrderStatus />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/admin/orders/manage" element={<AdminDashBoard />} />
      </Routes>
    </Suspense>
);

export default RoutesComponent;