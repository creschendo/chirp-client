// /posts routes. Posts come back as post views: { postId, author, content, quotedPost, deleted, ... }.
import { api, query } from './client.js';

// { content, parentPostId? } for a reply, { content, quotedPostId? } for a quote.
export const createPost = (fields) => api('/posts', { method: 'POST', body: fields });
export const getPost = (postId) => api(`/posts/${postId}`);
export const deletePost = (postId) => api(`/posts/${postId}`, { method: 'DELETE' });
export const listReplies = (postId, cursor) => api(`/posts/${postId}/replies${query({ cursor })}`);
