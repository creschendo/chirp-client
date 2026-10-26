// The API doesn't say yet whether you follow someone (no "isFollowing" flag on profiles), so this offers both
// actions. Both are idempotent on the server. TODO: a single toggle once profiles include the flag.
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { follow, unfollow } from '../../api/follows.js';
import { errorMessage } from '../../lib/format.js';

export default function FollowButtons({ userId }) {
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (action) => (action === 'follow' ? follow(userId) : unfollow(userId)),
    onSuccess: (_, action) => {
      setStatus(action === 'follow' ? 'Following' : 'Not following');
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });

  return (
    <div className="row">
      <button onClick={() => mutation.mutate('follow')} disabled={mutation.isPending}>
        Follow
      </button>
      <button className="secondary" onClick={() => mutation.mutate('unfollow')} disabled={mutation.isPending}>
        Unfollow
      </button>
      {status && <span className="muted">{status}</span>}
      {mutation.isError && <span className="error">{errorMessage(mutation.error)}</span>}
    </div>
  );
}
