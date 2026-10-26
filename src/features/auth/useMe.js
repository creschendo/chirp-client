// The logged-in user ({ userId, username, email, ... }) or null. Cached under ['me']; login and register put the
// returned account straight into this cache, logout clears it.
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/users.js';

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: getMe, staleTime: Infinity });
}
