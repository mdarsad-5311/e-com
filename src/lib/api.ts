/**
 * Centralized API Client for Django REST Framework Backend
 * Handles:
 * - Dynamic URL construction with Django trailing-slash support
 * - Automatic JWT Bearer authorization
 * - Seamless token refresh with concurrency protection and loop prevention
 * - JSON and FormData handling (automatic multipart boundaries)
 * - Structured ApiError handling (4xx, 5xx, network errors)
 */

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Pagination<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// Token Storage Helpers
// ---------------------------------------------------------------------------

const ACCESS_TOKEN_KEY = "ecommerce_access_token";
const REFRESH_TOKEN_KEY = "ecommerce_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  try {
    if (tokens.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
    }
    if (tokens.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    }
  } catch {
    /* ignore storage errors */
  }
}

export function updateAccessToken(accessToken: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch {
    /* ignore storage errors */
  }
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    /* ignore storage errors */
  }
}

// ---------------------------------------------------------------------------
// URL Builder
// ---------------------------------------------------------------------------

export function getBaseApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  return (envUrl && envUrl.trim()) ? envUrl.replace(/\/+$/, "") : "http://localhost:8000";
}

export function formatDjangoEndpoint(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const baseUrl = getBaseApiUrl();
  const trimmed = endpoint.trim();
  const normalizedEndpoint = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  const [pathPart, queryPart] = normalizedEndpoint.split("?");
  // Ensure trailing slash on pathPart unless it is a file extension
  const hasExtension = /\.[a-z0-9]+$/i.test(pathPart);
  const finalPath = (pathPart.endsWith("/") || hasExtension) ? pathPart : `${pathPart}/`;

  return queryPart !== undefined ? `${baseUrl}${finalPath}?${queryPart}` : `${baseUrl}${finalPath}`;
}

// ---------------------------------------------------------------------------
// Error Message Extraction
// ---------------------------------------------------------------------------

function extractErrorMessage(status: number, data: any): string {
  if (!data) {
    return `Request failed with status ${status}`;
  }
  if (typeof data === "string") {
    return data;
  }
  if (typeof data.detail === "string") {
    return data.detail;
  }
  if (typeof data.message === "string") {
    return data.message;
  }
  if (typeof data.error === "string") {
    return data.error;
  }
  // If validation errors like {"email": ["This field is required."]}
  if (typeof data === "object") {
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
        return `${key}: ${val[0]}`;
      }
      if (typeof val === "string") {
        return `${key}: ${val}`;
      }
    }
  }
  return `Request failed with status ${status}`;
}

// ---------------------------------------------------------------------------
// Request Interceptor & Token Refresh
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function requestTokenRefresh(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const url = formatDjangoEndpoint("/api/auth/token/refresh/");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        return null;
      }

      const data = await response.json();
      if (data.access) {
        updateAccessToken(data.access);
        if (data.refresh) {
          saveTokens({ access: data.access, refresh: data.refresh });
        }
        return data.access;
      }

      clearTokens();
      return null;
    } catch {
      clearTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ---------------------------------------------------------------------------
// Core HTTP Request Handler
// ---------------------------------------------------------------------------

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  _retry?: boolean;
}

export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, skipAuth = false, _retry = false, headers: customHeaders = {}, ...restInit } = options;

  let url = formatDjangoEndpoint(endpoint);

  // Append query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers = new Headers(customHeaders as HeadersInit);

  // Attach JWT Bearer token if present and not skipped
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  // Handle body: JSON vs FormData
  let formattedBody: any = undefined;
  if (body !== undefined && body !== null) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      // Browser automatically sets Content-Type with multipart boundary
      formattedBody = body;
    } else if (typeof body === "string") {
      formattedBody = body;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    } else {
      formattedBody = JSON.stringify(body);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...restInit,
      headers,
      body: formattedBody,
    });
  } catch (err: any) {
    throw new ApiError(
      0,
      err.message || "Network error. Unable to reach the server.",
      err
    );
  }

  // 401 Unauthorized handling with single refresh retry
  const isAuthEndpoint =
    endpoint.includes("/api/auth/login/") ||
    endpoint.includes("/api/auth/register/") ||
    endpoint.includes("/api/auth/token/refresh/");

  if (response.status === 401 && !_retry && !isAuthEndpoint && !skipAuth) {
    const newAccessToken = await requestTokenRefresh();
    if (newAccessToken) {
      // Retry once with new access token
      return request<T>(endpoint, {
        ...options,
        _retry: true,
      });
    }
  }

  // Parse response
  let data: any = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage = extractErrorMessage(response.status, data);
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Convenient API Methods
// ---------------------------------------------------------------------------

export const api = {
  get<T = any>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "POST", body });
  },

  put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },

  patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  },

  delete<T = any>(endpoint: string, options?: Omit<RequestOptions, "method">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
};

export default api;
