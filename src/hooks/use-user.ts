import { getUsers } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';

export function useGetUser() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: true,
  });
}
