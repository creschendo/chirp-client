// A user's followers or following, newest first, paginated with "Load more".
import { Link, useParams } from 'react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listFollows } from '../../api/follows.js';
import { errorMessage } from '../../lib/format.js';
import LoadMore from '../../components/LoadMore.jsx';

export default function FollowListPage({ list }) {
  const { username } = useParams();

  const follows = useInfiniteQuery({
    queryKey: ['follows', list, username.toLowerCase()],
    queryFn: ({ pageParam }) => listFollows(username, list, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const users = follows.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className="card">
      <h1>
        <Link to={`/${username}`}>@{username}</Link> · {list === 'followers' ? 'Followers' : 'Following'}
      </h1>
      {follows.isPending && <p className="muted">Loading…</p>}
      {follows.isError && <p className="error">{errorMessage(follows.error)}</p>}
      {follows.isSuccess && users.length === 0 && <p className="muted">Nobody yet.</p>}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.userId}>
            <Link to={`/${user.username}`}>
              <strong>{user.displayName}</strong> <span className="muted">@{user.username}</span>
            </Link>
          </li>
        ))}
      </ul>
      <LoadMore query={follows} />
    </section>
  );
}
