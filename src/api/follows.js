// Follow routes (mounted under /users on the server). Lists return { items, nextCursor }.
import { api, query } from './client.js';

export const follow = (userId) => api(`/users/me/following/${userId}`, { method: 'POST' });
export const unfollow = (userId) => api(`/users/me/following/${userId}`, { method: 'DELETE' });

// list is 'followers' or 'following'.
export const listFollows = (username, list, cursor) =>
  api(`/users/${encodeURIComponent(username)}/${list}${query({ cursor })}`);
