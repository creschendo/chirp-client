// Timeline routes. Both return { items, nextCursor } of post views, newest first.
import { api, query } from './client.js';

export const getHomeTimeline = (cursor) => api(`/timeline${query({ cursor })}`);
export const getProfileTimeline = (username, cursor) =>
  api(`/users/${encodeURIComponent(username)}/posts${query({ cursor })}`);
