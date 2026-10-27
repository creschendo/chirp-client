// Edit your own display name and bio (PATCH /users/me).
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe } from '../../api/users.js';
import { errorMessage } from '../../lib/format.js';

export default function EditProfileForm({ me }) {
  const [displayName, setDisplayName] = useState(me.displayName);
  const [bio, setBio] = useState(me.bio ?? '');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // An empty bio box clears the bio.
    mutationFn: () => updateMe({ displayName, bio: bio.trim() ? bio : null }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile', updated.username.toLowerCase()] });
      // Posts show the author's display name, so cached posts and feeds are stale too.
      queryClient.invalidateQueries({ predicate: (q) => ['post', 'replies', 'timeline'].includes(q.queryKey[0]) });
    },
  });

  return (
    <form
      className="card form"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <h2>Edit profile</h2>
      <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" />
      <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio (max 160)" rows={2} />
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
      {mutation.isSuccess && <p className="muted">Saved.</p>}
      <button type="submit" disabled={mutation.isPending}>
        Save
      </button>
    </form>
  );
}
