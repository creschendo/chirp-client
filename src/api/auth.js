// /auth routes. Login and register set the auth cookies; logout clears them.
import { api } from './client.js';

export const register = (fields) => api('/auth/register', { method: 'POST', body: fields });
export const login = (credentials) => api('/auth/login', { method: 'POST', body: credentials });
export const logout = () => api('/auth/logout', { method: 'POST' });
