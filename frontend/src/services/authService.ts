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
      // Register the user
      const registerResponse = await api.post("/customers/register/", {
        ...userData,
        password2: userData.password,
      });

      // Login immediately after registration
      const loginResponse = await api.post("/customers/login/", {
        email: userData.email,
        password: userData.password,
      });

      return {
        user: registerResponse.data,
        tokens: loginResponse.data,
      };
    } catch (error) {
      logError(error, "authService.register");
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await api.post("/customers/login/", credentials);
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      return response.data;
    } catch (error) {
      logError(error, "authService.login");
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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
