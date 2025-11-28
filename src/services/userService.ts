import type { User } from '@/types/User';

export const getUserProfile = async (userId: number): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    id: userId,
    name: 'Shahnewaz',
    email: 'shahnewaz@gmail.com'
  };
};
