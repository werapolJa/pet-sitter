import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

// Type for the decoded JWT token
interface SupabaseJwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

// Context API types
interface AuthContextType {
  user: SupabaseJwtPayload | null;
  login: (data: { [key: string]: string }) => Promise<void>;
  register: (data: { [key: string]: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// State type
interface State {
  loading: boolean | null; 
  error: string | null; 
  user: SupabaseJwtPayload | null; 
}

// Define the props type using PropsWithChildren
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    login: async () => Promise.resolve(),
    register: async () => Promise.resolve(),
    logout: () => {},
    isAuthenticated: false,
  });
  

function AuthProvider({ children }: AuthProviderProps) {  
  const [state, setState] = useState<State>({
    loading: null,
    error: null,
    user: null,
  });

  const router = useRouter();

  // make a login request
  const login = async (data: { [key: string]: string }) => {
    const result = await axios.post("/api/petowners/auth/login", data);
    const token = result.data.access_token;
    localStorage.setItem("token", token);
    const userDataFromToken = jwtDecode<SupabaseJwtPayload>(token);
    setState({ ...state, user: userDataFromToken });
    router.push("/");
  };

  // register the user
  const register = async (data: { [key: string]: string }) => {
    await axios.post("/api/petowners/auth/register", data);
    router.push("/petowners/login");
  };

  // clear the token in localStorage and the user data
  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state, user: null, error: null });
  };

  const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, register, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This is a hook that consumes AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
