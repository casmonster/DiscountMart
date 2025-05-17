// 🚀 Updated: routes.tsx with lazy loading and Suspense wrapper for route-level code-splitting

import { lazy, Suspense } from 'react';
import {  Route, Routes } from 'react-router-dom';

// ✅ Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Category = lazy(() => import('./pages/Category'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const PickupPolicy = lazy(() => import('./pages/PickupPolicy'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const StoreInfo = lazy(() => import('./pages/StoreInfo'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/not-found'));

const RoutesComponent = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:slug" element={<Category params={{
                    slug: ''
                }} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/order-confirmation" element={<OrderConfirmation params={{
                    id: ''
                }} />} />
        <Route path="/pickup-policy" element={<PickupPolicy />} />
        <Route path="/product/:slug" element={<ProductDetail params={{
                    slug: ''
                }} />} />
        <Route path="/store-info" element={<StoreInfo />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
);

export default RoutesComponent;
