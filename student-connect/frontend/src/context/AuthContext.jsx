import { createContext, useContext, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

// We intentionally use sessionStorage (not localStorage) so that closing the
// browser/tab always requires logging in again with a password next time.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    if (data.token && data.user) {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
