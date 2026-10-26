// Route table. Static paths (/login, /posts/...) win over /:username, so usernames can't shadow them.
import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout.jsx';
import HomePage from './features/posts/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';
import PostPage from './features/posts/PostPage.jsx';
import ProfilePage from './features/profile/ProfilePage.jsx';
import FollowListPage from './features/profile/FollowListPage.jsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/posts/:postId', element: <PostPage /> },
      { path: '/:username', element: <ProfilePage /> },
      { path: '/:username/followers', element: <FollowListPage list="followers" /> },
      { path: '/:username/following', element: <FollowListPage list="following" /> },
    ],
  },
]);
