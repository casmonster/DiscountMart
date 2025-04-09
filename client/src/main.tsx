import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Your context provider (replace with correct import if needed)
import MyContextProvider from "./MyContextProvider";

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// ✅ Single root render with all providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MyContextProvider>
        <App />
      </MyContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

