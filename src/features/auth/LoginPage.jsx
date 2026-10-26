import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../../api/auth.js';
import { errorMessage } from '../../lib/format.js';

export default function LoginPage() {
  const [fields, setFields] = useState({ login: '', password: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user);
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
      <h1>Log in</h1>
      <input name="login" placeholder="Username or email" value={fields.login} onChange={update} autoFocus />
      <input name="password" type="password" placeholder="Password" value={fields.password} onChange={update} />
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
      <button type="submit" disabled={mutation.isPending}>
        Log in
      </button>
      <p>
        No account? <Link to="/register">Sign up</Link>
      </p>
    </form>
  );
}
