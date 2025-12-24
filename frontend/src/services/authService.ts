import api from "./api";
import { User, AuthTokens, LoginCredentials, RegisterData } from "../types";

export const authService = {
  async register(
    userData: RegisterData
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post("/auth/register/", userData);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await api.post("/auth/login/", credentials);
    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.patch("/auth/me/", userData);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};

export default authService;
