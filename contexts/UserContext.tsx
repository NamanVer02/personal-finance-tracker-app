import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../interfaces/dto';

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Custom hook for easier usage
export const useUser = () => useContext(UserContext);

// UserProvider props type includes children
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
