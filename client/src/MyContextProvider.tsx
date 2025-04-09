import React, { createContext, ReactNode, useState } from "react";

// Define the context type
interface MyContextType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
export const MyContext = createContext<MyContextType | undefined>(undefined);

// Create the provider component
const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState("default value");

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;