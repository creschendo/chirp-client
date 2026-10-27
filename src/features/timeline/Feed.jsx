// A paginated list of posts: the home timeline or a profile's posts. Cached under ['timeline', ...] so anything that
// changes what a feed shows (posting, deleting, following) can refetch every feed with one invalidateQueries call.
import { useInfiniteQuery } from '@tanstack/react-query';
import PostCard from '../posts/PostCard.jsx';
import LoadMore from '../../components/LoadMore.jsx';
import { errorMessage } from '../../lib/format.js';

// queryKey: e.g. ['timeline', 'home']. fetchPage(cursor) -> { items, nextCursor }.
export default function Feed({ queryKey, fetchPage, emptyText }) {
  const feed = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  if (feed.isPending) return <p className="muted">Loading…</p>;
  if (feed.isError) return <p className="error">{errorMessage(feed.error)}</p>;

  const posts = feed.data.pages.flatMap((page) => page.items);
  if (posts.length === 0) return <p className="muted">{emptyText}</p>;

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
      <LoadMore query={feed} />
    </>
  );
}
