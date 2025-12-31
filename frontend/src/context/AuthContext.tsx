import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/authService";
import { User, LoginCredentials, RegisterData } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // authService.login already stores tokens in localStorage
    await authService.login(credentials);
    // Now fetch the current user with the stored token
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const register = async (userData: RegisterData): Promise<void> => {
    // authService.register already handles registration + auto-login and stores tokens
    const response = await authService.register(userData);
    // Tokens are already stored by authService, just set the user
    setUser(response.user);
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    const updatedUser = await authService.updateProfile(userData);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
