import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '../../api/auth.js';
import { errorMessage } from '../../lib/format.js';

export default function RegisterPage() {
  const [fields, setFields] = useState({ username: '', email: '', password: '', displayName: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    // displayName is optional; the server defaults it to the username.
    mutationFn: ({ displayName, ...rest }) => register(displayName.trim() ? { ...rest, displayName } : rest),
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user); // signing up logs you in
      navigate('/');
    },
  });

  const update = (event) => setFields({ ...fields, [event.target.name]: event.target.value });

  return (
    <form
      className="card form"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(fields);
      }}
    >
      <h1>Sign up</h1>
      <input
        name="username"
        placeholder="Username (3–15 letters, digits, _)"
        value={fields.username}
        onChange={update}
        autoFocus
      />
      <input name="email" type="email" placeholder="Email" value={fields.email} onChange={update} />
      <input
        name="password"
        type="password"
        placeholder="Password (8+ characters)"
        value={fields.password}
        onChange={update}
      />
      <input name="displayName" placeholder="Display name (optional)" value={fields.displayName} onChange={update} />
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
      <button type="submit" disabled={mutation.isPending}>
        Sign up
      </button>
      <p>
        Have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
