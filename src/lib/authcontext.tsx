import axios from "axios";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
    profile: () => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
axios.defaults.baseURL = "https://15.207.221.31:1234";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("token")
    );
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
    const register = async (fullName: string, email: string, password: string) => {
        try {
        const response = await axios.post("/api/register", { fullName, email, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
        }
        } catch (error) {
        console.error("Registration failed:", error);
        throw error;
        }
    };
    const profile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.get("/api/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
        return response.data;
        } catch (error) {
            console.error("Fetching profile failed:", error);
            localStorage.removeItem("token");
            throw error;
        }
    };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, profile, logout }}>
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