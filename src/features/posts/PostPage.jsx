// A post, its direct replies (oldest first, paginated), and boxes to reply to or quote it.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPost, listReplies } from '../../api/posts.js';
import { useMe } from '../auth/useMe.js';
import { errorMessage } from '../../lib/format.js';
import PostCard from './PostCard.jsx';
import Composer from './Composer.jsx';
import LoadMore from '../../components/LoadMore.jsx';

export default function PostPage() {
  const { postId } = useParams();
  const { data: me } = useMe();
  const [quoting, setQuoting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const post = useQuery({ queryKey: ['post', postId], queryFn: () => getPost(postId) });
  const replies = useInfiniteQuery({
    queryKey: ['replies', postId],
    queryFn: ({ pageParam }) => listReplies(postId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  if (post.isPending) return <p className="muted">Loading…</p>;
  if (post.isError) return <p className="error">{errorMessage(post.error)}</p>;

  const canInteract = me && !post.data.deleted;

  return (
    <>
      <PostCard post={post.data} />

      {canInteract && (
        <div className="row">
          <button className="link" onClick={() => setQuoting(!quoting)}>
            {quoting ? 'Cancel quote' : 'Quote'}
          </button>
        </div>
      )}
      {canInteract && quoting && (
        <Composer
          quotedPostId={postId}
          placeholder="Add your take"
          onPosted={(quote) => navigate(`/posts/${quote.postId}`)}
        />
      )}
      {canInteract && (
        <Composer
          parentPostId={postId}
          placeholder="Post your reply"
          onPosted={() => queryClient.invalidateQueries({ queryKey: ['replies', postId] })}
        />
      )}

      <h2>Replies</h2>
      {replies.isError && <p className="error">{errorMessage(replies.error)}</p>}
      {replies.data?.pages
        .flatMap((page) => page.items)
        .map((reply) => (
          <PostCard key={reply.postId} post={reply} />
        ))}
      {replies.data?.pages[0].items.length === 0 && <p className="muted">No replies yet.</p>}
      <LoadMore query={replies} />
    </>
  );
}
