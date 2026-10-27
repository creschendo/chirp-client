# chirp-client

Frontend for Chirp, a Twitter clone. React + Vite, talking to [chirp-service](../chirp-service) over its REST API.

## Running locally

1. Start chirp-service (from `chirp-service/`: `npm run dev:all`). It must allow this origin: its `CLIENT_ORIGIN`
   is `http://localhost:5173`.
2. Install and start the client:

   ```sh
   npm install
   npm run dev
   ```

3. Open http://localhost:5173

The API URL defaults to `http://localhost:4000`; set `VITE_API_URL` in `.env` to change it (see `.env.example`).

## Scripts

| Script            | Purpose                                 |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Dev server on port 5173 with hot reload |
| `npm run build`   | Production build into `dist/`           |
| `npm run preview` | Serve the production build              |
| `npm run format`  | Format with Prettier                    |

## Structure

```
src/
  main.jsx            React root, TanStack Query and router providers
  App.jsx             route table
  api/                one file per backend module; the only code that makes HTTP requests
    client.js         fetch wrapper: cookies, JSON, errors, refresh-and-retry on 401
  features/           screens and their components, grouped like the backend's modules
    auth/             login, sign up, useMe() (the current user)
    profile/          profile page, edit form, follow buttons, follower/following lists
    posts/            home, composer, post card, post page with replies
    timeline/         Feed: the home timeline and a profile's posts, with "load more"
  components/         shared UI (layout, "load more")
  lib/                small helpers (formatting)
```

## How auth works here

- The server sets two `httpOnly` cookies on login/sign-up. JavaScript never sees the tokens; every request sends
  them because `api/client.js` uses `credentials: 'include'`.
- When a request gets a 401 (the 15-minute access token expired), `client.js` calls `POST /auth/refresh` once and
  retries. Concurrent 401s share one refresh: two refreshes with the same token look like theft to the server, which
  would log the user out everywhere.
- `useMe()` returns the current user or `null`; login and sign-up put the returned account straight into its cache.

## Data fetching

Server data goes through TanStack Query: `useQuery` for single resources, `useInfiniteQuery` for paginated lists.
The API's lists return `{ items, nextCursor }`, which maps directly onto `getNextPageParam`.

Feeds are cached under `['timeline', ...]`. Anything that changes what a feed shows invalidates that prefix so
every feed refetches: posting (Composer), deleting (PostCard), following/unfollowing (FollowButtons) and editing
your display name (EditProfileForm).

## Not built yet

- Follow state on profiles: the API has no "you follow them" flag yet, so profiles show both Follow and Unfollow
- Counts, likes, reposts, notifications, messages
