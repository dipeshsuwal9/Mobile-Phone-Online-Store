import api from "./api";
import { User, AuthTokens, LoginCredentials, RegisterData } from "../types";
import { handleApiError, logError } from "../utils/errorHandler";

export const authService = {
  /**
   * Register a new user
   */
  async register(
    userData: RegisterData
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      if (import.meta.env.DEV) {
        console.log("Registration request:", {
          email: userData.email,
          name: userData.name,
          hasPhone: !!userData.phone,
          hasAddress: !!userData.address,
        });
      }

      // Register the user
      const registerResponse = await api.post("/customers/register/", {
        ...userData,
        password2: userData.password,
      });

      if (import.meta.env.DEV) {
        console.log("Registration successful:", registerResponse.data);
      }

      // Login immediately after registration
      const loginResponse = await api.post("/customers/login/", {
        email: userData.email,
        password: userData.password,
      });

      // Store tokens immediately
      const { access, refresh } = loginResponse.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      if (import.meta.env.DEV) {
        console.log("Auto-login successful, tokens stored");
      }

      return {
        user: registerResponse.data,
        tokens: loginResponse.data,
      };
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Registration failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }

      logError(error, "authService.register");

      // Re-throw the error with the original response for proper error extraction
      throw error;
    }
  },

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      if (import.meta.env.DEV) {
        console.log("Login request for:", credentials.email);
      }

      const response = await api.post("/customers/login/", credentials);
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      if (import.meta.env.DEV) {
        console.log("Login successful");
      }

      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Login failed:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      logError(error, "authService.login");

      // Re-throw the error for proper handling in the component
      throw error;
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (import.meta.env.DEV) {
        console.log("Logout successful");
      }
    } catch (error) {
      logError(error, "authService.logout");
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/customers/profiles/me/");
      return response.data;
    } catch (error) {
      logError(error, "authService.getCurrentUser");
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch(
        "/customers/profiles/update_profile/",
        userData
      );
      return response.data;
    } catch (error) {
      logError(error, "authService.updateProfile");
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};

export default authService;
