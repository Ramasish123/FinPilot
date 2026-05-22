/**
 * FinPilot AI — API Client
 * Centralized API client with JWT authentication
 */

const API_BASE = "http://localhost:5050/api";

// ==========================================
// Token Management
// ==========================================

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("finpilot_token");
}

export function setToken(token: string): void {
  localStorage.setItem("finpilot_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("finpilot_token");
  localStorage.removeItem("finpilot_user");
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("finpilot_user");
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user: any): void {
  localStorage.setItem("finpilot_user", JSON.stringify(user));
}

// ==========================================
// HTTP Helpers
// ==========================================

async function request(method: string, path: string, body?: any): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  // Handle CSV responses
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv")) {
    return res.text();
  }

  return res.json();
}

export const api = {
  get: (path: string) => request("GET", path),
  post: (path: string, body?: any) => request("POST", path, body),
  put: (path: string, body?: any) => request("PUT", path, body),
  patch: (path: string, body?: any) => request("PATCH", path, body),
  delete: (path: string) => request("DELETE", path),
};

// ==========================================
// Auth
// ==========================================

export async function login(email: string, password: string) {
  const data = await api.post("/auth/login", { email, password });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const data = await api.post("/auth/signup", { name, email, password });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export function logout() {
  clearToken();
}

// ==========================================
// CSV Export Helper
// ==========================================

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportData(type: string, filename?: string) {
  const csv = await api.get(`/export/${type}`);
  downloadCSV(csv, filename || `${type}_export_${new Date().toISOString().split("T")[0]}.csv`);
}

// ==========================================
// JSON Export Helper
// ==========================================

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
