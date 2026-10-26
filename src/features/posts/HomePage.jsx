import { Link, useNavigate } from 'react-router';
import { useMe } from '../auth/useMe.js';
import Composer from './Composer.jsx';

export default function HomePage() {
  const { data: me, isPending } = useMe();
  const navigate = useNavigate();

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
      <Composer onPosted={(post) => navigate(`/posts/${post.postId}`)} />
      {/* TODO: home feed, once GET /timeline exists in chirp-service. */}
      <p className="muted">Your home feed will appear here once the timeline API is built.</p>
    </>
  );
}
