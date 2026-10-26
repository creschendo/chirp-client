// /users routes (account and profiles).
import { api, ApiError } from './client.js';

// The logged-in user's account, or null when not logged in (after a refresh attempt failed).
export async function getMe() {
  try {
    return await api('/users/me');
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export const updateMe = (fields) => api('/users/me', { method: 'PATCH', body: fields });
export const getProfile = (username) => api(`/users/${encodeURIComponent(username)}`);
