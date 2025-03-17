import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../services/userService';

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
  storeUserSession: (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => void;
  clearUserSession: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userContext, setUserContext] = useState<User | null>(null);
  const navigate = useNavigate();

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

  const storeUserSession = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    const { user, accessToken, refreshToken } = userData;
    setUserContext({
      username: user.username,
      _id: user._id,
      profileImage: user.profileImage,
    });
    localStorage.setItem('userId', user._id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const clearUserSession = () => {
    setUserContext(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  return (
    <UserContext.Provider
      value={{
        userContext,
        setUserContext,
        updateContextUsername,
        updateContextProfileImage,
        storeUserSession,
        clearUserSession,
      }}
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
