// Text box for a new post, a reply (parentPostId) or a quote (quotedPostId).
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPost } from '../../api/posts.js';
import { errorMessage } from '../../lib/format.js';

const MAX_LENGTH = 280;

export default function Composer({ parentPostId, quotedPostId, placeholder = "What's happening?", onPosted }) {
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: () => createPost({ content, parentPostId, quotedPostId }),
    onSuccess: (post) => {
      setContent('');
      onPosted?.(post);
    },
  });

  const length = content.trim().length;

  return (
    <form
      className="card composer"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="row">
        <span className={length > MAX_LENGTH ? 'error' : 'muted'}>
          {length}/{MAX_LENGTH}
        </span>
        <button type="submit" disabled={mutation.isPending || length === 0 || length > MAX_LENGTH}>
          Post
        </button>
      </div>
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
    </form>
  );
}
