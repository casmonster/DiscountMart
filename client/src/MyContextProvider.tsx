import * as React from "react";
const { createContext, useState, useCallback, useContext } = React;
type ReactNode = React.ReactNode;

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
// Create the provider component
const MyContextProvider = ({ children, initialValue = "default value" }: {
  children: ReactNode;
  initialValue?: string;
}) => {
  const [value, setValue] = useState(initialValue);

   // Add reset functionality
   const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Add update functionality with validation
  const updateValue = useCallback((newValue: string) => {
    if (typeof newValue !== 'string') {
      throw new Error('Value must be a string');
    }
    setValue(newValue);
  }, []);

  // Check if current value is default
  const isDefaultValue = value === initialValue;

  const contextValue = {
    value,
    setValue,
    resetValue,
    updateValue,
    isDefaultValue,
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;