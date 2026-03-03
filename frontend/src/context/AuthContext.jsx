import { createContext, useContext, useMemo, useState } from "react";
import { LOCAL_KEYS } from "../utils/constants";
import httpClient from "../services/httpClient";

const AuthContext = createContext(null);

const readCurrentUser = () => {
  const raw = localStorage.getItem(LOCAL_KEYS.CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(readCurrentUser);

  const login = async (email, password) => {
    const { data } = await httpClient.post("/auth/login", { email, password });
    const { token, user } = data;
    localStorage.setItem(LOCAL_KEYS.TOKEN, token);
    localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const register = async (payload) => {
    const { data } = await httpClient.post("/auth/register", payload);
    const { token, user } = data;
    localStorage.setItem(LOCAL_KEYS.TOKEN, token);
    localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_KEYS.CURRENT_USER);
    localStorage.removeItem(LOCAL_KEYS.TOKEN);
  };

  const refreshCurrentUser = async () => {
    if (!currentUser) return;
    const { data } = await httpClient.get("/users/me");
    setCurrentUser(data);
    localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(data));
  };

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      register,
      refreshCurrentUser,
      isAuthenticated: !!currentUser
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
