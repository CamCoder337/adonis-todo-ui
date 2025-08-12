import Cookies from 'js-cookie';
import { AuthResponse, User } from '@/types';

export const AUTH_COOKIE_NAME = 'token';
export const USER_COOKIE_NAME = 'user';

export const setAuthData = (authData: AuthResponse) => {
  Cookies.set(AUTH_COOKIE_NAME, authData.token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  Cookies.set(USER_COOKIE_NAME, JSON.stringify(authData.user), { 
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const clearAuthData = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_COOKIE_NAME);
};

export const getAuthUser = (): User | null => {
  try {
    const userStr = Cookies.get(USER_COOKIE_NAME);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};