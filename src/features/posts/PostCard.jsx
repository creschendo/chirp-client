// One post view. Deleted posts keep their place (threads and quotes still point at them) but show no content.
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../../api/posts.js';
import { useMe } from '../auth/useMe.js';
import { formatTime, errorMessage } from '../../lib/format.js';

export default function PostCard({ post, embedded = false }) {
  const { data: me } = useMe();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: () => deletePost(post.postId),
    // Refetch anything that shows this post: its own page, replies lists, and feeds (which hide deleted posts).
    onSuccess: () =>
      queryClient.invalidateQueries({ predicate: (q) => ['post', 'replies', 'timeline'].includes(q.queryKey[0]) }),
  });

  if (post.deleted) {
    return (
      <article className={embedded ? 'post embedded deleted' : 'post deleted'}>
        <Link to={`/posts/${post.postId}`}>This post was deleted.</Link>
      </article>
    );
  }

  const isMine = me && me.userId === post.author.userId;

  return (
    <article className={embedded ? 'post embedded' : 'post'}>
      <header>
        <Link to={`/${post.author.username}`} className="author">
          <strong>{post.author.displayName}</strong> <span className="muted">@{post.author.username}</span>
        </Link>
        <Link to={`/posts/${post.postId}`} className="muted time">
          {formatTime(post.createdAt)}
        </Link>
      </header>
      {post.parentPostId && !embedded && (
        <p className="muted small">
          Replying to <Link to={`/posts/${post.parentPostId}`}>a post</Link>
        </p>
      )}
      <p className="content">{post.content}</p>
      {/* One level of quote is embedded; a quote inside it is only linked. */}
      {post.quotedPost && <PostCard post={post.quotedPost} embedded />}
      {embedded && post.quotedPostId && (
        <p className="muted small">
          Quoting <Link to={`/posts/${post.quotedPostId}`}>another post</Link>
        </p>
      )}
      {isMine && !embedded && (
        <footer>
          <button className="link danger" onClick={() => remove.mutate()} disabled={remove.isPending}>
            Delete
          </button>
          {remove.isError && <span className="error">{errorMessage(remove.error)}</span>}
        </footer>
      )}
    </article>
  );
}
