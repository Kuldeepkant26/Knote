import { useAuthStore } from "@/stores/authStore";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

// Endpoints that must never trigger the 401 auto-refresh / retry loop.
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

export class ApiError extends Error {
  constructor(message, { status, errors = [] } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // [{ field, message }]
  }
}

async function parseResponse(res) {
  let body;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (shouldn't happen with this API, but stay defensive).
    body = null;
  }

  if (res.ok && body?.success) {
    return body.data;
  }

  throw new ApiError(body?.message || `Request failed (${res.status})`, {
    status: res.status,
    errors: body?.errors || [],
  });
}

function buildRequest(path, { method = "GET", body, headers = {} } = {}) {
  const token = useAuthStore.getState().accessToken;
  const finalHeaders = { ...headers };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${BASE}${path}`, {
    method,
    credentials: "include", // always send the httpOnly refresh cookie
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function request(path, options = {}) {
  let res = await buildRequest(path, options);

  // Transparently refresh the access token once on a 401, then replay.
  const canRetry = res.status === 401 && !NO_REFRESH_PATHS.includes(path) && !options._retried;
  if (canRetry) {
    try {
      await useAuthStore.getState().refresh();
    } catch {
      useAuthStore.getState().clearAuth();
      return parseResponse(res); // surfaces the original 401 as an ApiError
    }
    res = await buildRequest(path, { ...options, _retried: true });
  }

  return parseResponse(res);
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
