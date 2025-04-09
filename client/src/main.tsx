import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import React from 'react';
import ReactDOM from 'react-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

console.log('Wrapping App with providers');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
