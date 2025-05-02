import * as SecureStore from 'expo-secure-store';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../interfaces/types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: async () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  // setUser both updates state and persists to SecureStore
  const setUser = async (user: User | null) => {
    setUserState(user);
    if (user) {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } else {
      await SecureStore.deleteItemAsync('user');
    }
  };

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
