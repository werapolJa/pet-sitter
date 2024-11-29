import { useEffect, useState } from "react";
import React from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/router";

// Same types as before
interface SupabaseJwtPayload {
  sub: string;  //UID
  email: string; 
  role: string;
  exp: number;
}

interface AuthContextType {
  user: SupabaseJwtPayload | null;
  login: (data: { [key: string]: string }) => Promise<void>;
  register: (data: { [key: string]: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface State {
  loading: boolean;
  error: string | null;
  user: SupabaseJwtPayload | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    user: null,
  });

  const router = useRouter();

  // Load user from localStorage on client-side render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode<SupabaseJwtPayload>(token);
        setState({ loading: false, error: null, user: userDataFromToken });
      } catch (err) {
        console.error("Invalid token:", err);
        setState({ loading: false, error: "Invalid token", user: null });
      }
    } else {
      setState({ loading: false, error: null, user: null });
    }
  }, []);

  // Login method
  const login = async (data: { [key: string]: string }) => {
    try {
      const result = await axios.post("/api/petowners/auth/login", data);
      const token = result.data.access_token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode<SupabaseJwtPayload>(token);
      setState({ ...state, user: userDataFromToken });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Register method
  const register = async (data: { [key: string]: string }) => {
    await axios.post("/api/petowners/auth/register", data);
    router.push("/petowners/login");
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state, user: null, error: null });
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout, register, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
