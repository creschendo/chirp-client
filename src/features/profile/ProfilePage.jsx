import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../api/users.js';
import { useMe } from '../auth/useMe.js';
import { errorMessage, formatTime } from '../../lib/format.js';
import EditProfileForm from './EditProfileForm.jsx';
import FollowButtons from './FollowButtons.jsx';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: me } = useMe();
  const profile = useQuery({ queryKey: ['profile', username.toLowerCase()], queryFn: () => getProfile(username) });

  if (profile.isPending) return <p className="muted">Loading…</p>;
  if (profile.isError) return <p className="error">{errorMessage(profile.error)}</p>;

  const user = profile.data;
  const isMe = me && me.userId === user.userId;

  return (
    <>
      <section className="card">
        <h1>{user.displayName}</h1>
        <p className="muted">@{user.username}</p>
        {user.bio && <p>{user.bio}</p>}
        <p className="muted small">Joined {formatTime(user.createdAt)}</p>
        <p className="row">
          <Link to={`/${user.username}/followers`}>Followers</Link>
          <Link to={`/${user.username}/following`}>Following</Link>
        </p>
        {me && !isMe && <FollowButtons userId={user.userId} />}
      </section>

      {isMe && <EditProfileForm me={me} />}

      {/* TODO: this user's posts, once GET /users/:username/posts exists in chirp-service. */}
      <p className="muted">Posts will appear here once the profile timeline API is built.</p>
    </>
  );
}
