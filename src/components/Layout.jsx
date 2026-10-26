// Page frame: nav bar on top, the current route below.
import { Link, Outlet, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../features/auth/useMe.js';
import { logout } from '../api/auth.js';

export default function Layout() {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    queryClient.clear(); // drop everything cached for this user
    navigate('/login');
  }

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="brand">
          Chirp
        </Link>
        {me ? (
          <>
            <Link to={`/${me.username}`}>@{me.username}</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
