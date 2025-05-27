import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const { createContext, useState, useCallback, useContext } = React;
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
type ReactNode = React.ReactNode;
// Create QueryClient instance
const queryClient = new QueryClient();
// Define the context type
interface MyContextType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  updateValue: (newValue: string) => void;
  isDefaultValue: boolean;
}
// Create the context
export const MyContext = createContext<MyContextType | undefined>(undefined);
// Custom hook for using the context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
// Provider component
const MyContextProvider = ({
  children,
  initialValue = "default value"
}: {
  children: ReactNode;
  initialValue?: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  const updateValue = useCallback((newValue: string) => {
    if (typeof newValue !== 'string') {
      throw new Error('Value must be a string');
    }
    setValue(newValue);
  }, []);
  const isDefaultValue = value === initialValue;
  const contextValue = {
    value,
    setValue,
    updateValue,
    isDefaultValue,
  };
  return (
    <MyContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              {children}
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </QueryClientProvider>
    </MyContext.Provider>
  );
};
export default MyContextProvider;