/**
 * api.ts — QuickServIndia Backend API Integration
 * ──────────────────────────────────────────────
 * This file handles all communication with the Spring Boot backend.
 * It stores user credentials in the database via REST API calls.
 */

const API_BASE_URL = "http://localhost:8080/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CustomerRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: string;
}

export interface ProviderRegistrationData {
  name: string;
  email: string;
  businessName: string;
  serviceCategory: string;
  location: string;
  phone: string;
  password: string;
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  password: string;
  adminKey: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new customer in the database
 */
export async function registerCustomerAPI(data: CustomerRegistrationData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
      return {
        success: false,
        error: errorData.message || "Failed to register customer",
      };
    }

    const authData: AuthResponse = await response.json();
    return {
      success: true,
      data: authData,
    };
  } catch (error) {
    console.error("Customer registration error:", error);
    return {
      success: false,
      error: "Network error. Please check if backend is running.",
    };
  }
}

/**
 * Register a new provider in the database
 */
export async function registerProviderAPI(data: ProviderRegistrationData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
      return {
        success: false,
        error: errorData.message || "Failed to register provider",
      };
    }

    const authData: AuthResponse = await response.json();
    return {
      success: true,
      data: authData,
    };
  } catch (error) {
    console.error("Provider registration error:", error);
    return {
      success: false,
      error: "Network error. Please check if backend is running.",
    };
  }
}

/**
 * Register a new admin in the database
 */
export async function registerAdminAPI(data: AdminRegistrationData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
      return {
        success: false,
        error: errorData.message || "Failed to register admin",
      };
    }

    const authData: AuthResponse = await response.json();
    return {
      success: true,
      data: authData,
    };
  } catch (error) {
    console.error("Admin registration error:", error);
    return {
      success: false,
      error: "Network error. Please check if backend is running.",
    };
  }
}

/**
 * Login user and get JWT token
 */
export async function loginAPI(data: LoginData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Login failed" }));
      return {
        success: false,
        error: errorData.message || "Invalid email or password",
      };
    }

    const authData: AuthResponse = await response.json();
    return {
      success: true,
      data: authData,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Network error. Please check if backend is running.",
    };
  }
}

/**
 * Store authentication token and user data in localStorage
 */
export function storeAuthData(authResponse: AuthResponse): void {
  localStorage.setItem("qs_token", authResponse.token);
  localStorage.setItem("qs_user", JSON.stringify({
    id: authResponse.id,
    name: authResponse.name,
    email: authResponse.email,
    role: authResponse.role.toLowerCase(),
  }));
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("qs_token");
}

/**
 * Get stored user data
 */
export function getStoredUser(): { id: number; name: string; email: string; role: string } | null {
  const userData = localStorage.getItem("qs_user");
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Clear authentication data (logout)
 */
export function clearAuthData(): void {
  localStorage.removeItem("qs_token");
  localStorage.removeItem("qs_user");
  localStorage.removeItem("qs_session");
}

/**
 * Make authenticated API request
 */
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  if (!token) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Request failed" }));
      return {
        success: false,
        error: errorData.message || "Request failed",
      };
    }

    const data: T = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      error: "Network error",
    };
  }
}

/**
 * API client object for making HTTP requests
 */
export const api = {
  async get<T = any>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
