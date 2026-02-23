import { createContext, useContext, useMemo, useState } from "react";
import { LOCAL_KEYS } from "../utils/constants";
import { useData } from "./DataContext";

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
  const { users, registerUser } = useData();
  const [currentUser, setCurrentUser] = useState(readCurrentUser);

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error("Invalid email or password.");
    setCurrentUser(user);
    localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  };

  const register = (payload) => {
    const user = registerUser(payload);
    setCurrentUser(user);
    localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_KEYS.CURRENT_USER);
  };

  const refreshCurrentUser = () => {
    if (!currentUser) return;
    const latest = users.find((u) => u.id === currentUser.id);
    if (latest) {
      setCurrentUser(latest);
      localStorage.setItem(LOCAL_KEYS.CURRENT_USER, JSON.stringify(latest));
    }
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
    [currentUser, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
