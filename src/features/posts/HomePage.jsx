import { Link } from 'react-router';
import { useMe } from '../auth/useMe.js';
import { getHomeTimeline } from '../../api/timeline.js';
import Composer from './Composer.jsx';
import Feed from '../timeline/Feed.jsx';

export default function HomePage() {
  const { data: me, isPending } = useMe();

  if (isPending) return <p className="muted">Loading…</p>;

  if (!me) {
    return (
      <div className="card">
        <h1>Welcome to Chirp</h1>
        <p>
          <Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> to post.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Composer refreshes the feeds itself after posting, so the new post shows up at the top. */}
      <Composer />
      <Feed
        queryKey={['timeline', 'home']}
        fetchPage={getHomeTimeline}
        emptyText="Nothing here yet. Post something, or follow people to see their posts."
      />
    </>
  );
}
