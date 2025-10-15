import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
  exp: number; // expiration timestamp in seconds
  userId: number; // Add user ID if present in token
  name: string; // Add name if present in token
  email: string; // Add email if present in token
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(Cookies.get('accessToken') || null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!Cookies.get('accessToken'));
  const [loading, setLoading] = useState<boolean>(true);

  const setAccessToken = (token: string | null) => {
    if (token) {
      Cookies.set('accessToken', token, { expires: 7 }); // expires in 7 days
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUser({
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email,
      });
    } else {
      Cookies.remove('accessToken');
      setUser(null);
    }
    setAccessTokenState(token);
  };

  useEffect(() => {
    const token = Cookies.get('accessToken');

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
    } else {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          Cookies.remove('accessToken');
          setAccessTokenState(null);
          setIsLoggedIn(false);
        } else {
          setAccessTokenState(token);
          setIsLoggedIn(true);
          setUser({
            id: decodedToken.userId,
            name: decodedToken.name,
            email: decodedToken.email,
          });
        }
      } catch (error) {
        console.error('Error decoding token', error);
        setIsLoggedIn(false);
      }
      setLoading(false);
    }
  }, []);

  const logout = () => {
    Cookies.remove('accessToken');
    setAccessTokenState(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      user,
      isLoggedIn,
      loading,
      setAccessToken,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};