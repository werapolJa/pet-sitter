import { useEffect, useState } from "react";
import React from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/router";

// Same types as before
interface SupabaseJwtPayload {
  sub: string; // UID
  email: string;
  role: string;
  exp: number;
  iat: number;
  aud: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    role: string;
    sub: string;
  };
  aal: string;
  amr: {
    method: string;
    timestamp: number;
  }[];
  is_anonymous: boolean;
}

interface AuthContextType {
  user: SupabaseJwtPayload | null;
  login: (data: { [key: string]: string }) => Promise<void>;
  loginAdmin: (data: { [key: string]: string }) => Promise<void>;
  register: (data: { [key: string]: string }) => Promise<void>;
  logout: () => void;
  logoutAdmin: () => void;
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
    const result = await axios.post("/api/petowners/auth/login", data);
    const token = result.data.access_token;
    localStorage.setItem("token", token);
    const userDataFromToken = jwtDecode<SupabaseJwtPayload>(token);
    setState({ ...state, user: userDataFromToken });
    router.push("/");
  };

  // Login for Admin
  const loginAdmin = async (data: { [key: string]: string }) => {
    try {
      const result = await axios.post("/api/admin/login", data);
      const token = result.data.access_token;
      localStorage.setItem("adminToken", token);
      // Redirect or set login state here
      const decoded = jwtDecode(token) as SupabaseJwtPayload;
      if (decoded.role === "admin") {
        setState({ ...state, user: decoded });
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Handle 401 Unauthorized error
          alert("Unauthorized: Invalid username or password.");
        } else {
          alert(
            `Error: ${error.response?.status || "Unknown error occurred."}`
          );
        }
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
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
    router.push("/");
  };

  // Logout for Admin method
  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setState({ ...state, user: null, error: null });
    router.push("/");
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        register,
        loginAdmin,
        logoutAdmin,
        isAuthenticated,
      }}
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
