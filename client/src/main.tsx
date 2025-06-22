// Removed unused imports and components


import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import '@fontsource/inter'; 
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import MyContextProvider from "./MyContextProvider";
import { CartProvider } from "./context/CartContext";


const basename = import.meta.env.MODE === 'production' ? '/DiscountMart' : '';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
          <MyContextProvider>
            <App />
            <Toaster position="bottom-right" />
          </MyContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
