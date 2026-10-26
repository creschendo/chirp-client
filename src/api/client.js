// The one place that talks HTTP to chirp-service. Every feature calls the functions in api/*.js, never fetch.
// Auth is two httpOnly cookies set by the server: JavaScript can't read them, the browser sends them because every
// request uses credentials: 'include'.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// A failed response. body is the server's JSON error, e.g. { error, issues? }.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error ?? `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

// The access token lasts 15 minutes. When a request gets 401, refresh once and retry. Several requests can hit
// 401 together, so they share one in-flight refresh: two refreshes with the same token look like token theft to
// the server, which then logs the user out everywhere.
let refreshing = null;

function refreshSession() {
  refreshing ??= fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// api('/posts', { method: 'POST', body: { content } }) -> parsed JSON, null for 204, or throws ApiError.
export async function api(path, { method = 'GET', body } = {}, retried = false) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // /auth/* routes answer 401 for wrong credentials or a dead session; refreshing wouldn't help there.
  if (res.status === 401 && !retried && !path.startsWith('/auth/')) {
    if (await refreshSession()) {
      return api(path, { method, body }, true);
    }
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data);
  }
  return data;
}

// Builds a query string, skipping null/undefined values: query({ limit: 20, cursor: null }) -> '?limit=20'.
export function query(params) {
  const entries = Object.entries(params).filter(([, value]) => value !== null && value !== undefined);
  return entries.length ? `?${new URLSearchParams(entries)}` : '';
}
