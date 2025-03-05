import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  _id: string;
  profileImage?: string;
}

interface UserContextType {
  userContext: User | null;
  setUserContext: (user: User | null) => void;
  updateContextUsername: (username: string) => void;
  updateContextProfileImage: (profileImage: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userContext, setUserContext] = useState<User | null>(null);

  const updateContextUsername = (newUsername: string) => {
    if (userContext) {
      setUserContext({ ...userContext, username: newUsername });
    }
  };

  const updateContextProfileImage = (newProfileImage: string) => {
    if (userContext) {
      setUserContext({ ...userContext, profileImage: newProfileImage });
    }
  };

  return (
    <UserContext.Provider
      value={{ userContext, setUserContext, updateContextUsername, updateContextProfileImage }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
