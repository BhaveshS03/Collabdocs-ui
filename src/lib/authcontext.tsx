import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  profile: () => Promise<User>;
  logout: () => void;
  googleLogin: () => void;
  checkAuth: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
axios.defaults.baseURL = "https://api.myzen.works";
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth tokens
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    checkAuth();
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/status");
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Token is invalid
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await axios.post("/api/register", {
        fullName: fullName,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const profile = async (): Promise<User> => {
    try {
      const response = await axios.get("/api/profile");
      setUser(response.data.user);
      return response.data.user;
    } catch (error: any) {
      console.error("Fetching profile failed:", error);
      logout();
      throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
  };

  const googleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${axios.defaults.baseURL}/api/google`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        profile,
        logout,
        googleLogin,
        checkAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
