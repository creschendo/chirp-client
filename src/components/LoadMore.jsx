// "Load more" button for useInfiniteQuery lists ({ items, nextCursor } pages).
export default function LoadMore({ query }) {
  if (!query.hasNextPage) return null;
  return (
    <button className="load-more" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage}>
      {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
    </button>
  );
}
