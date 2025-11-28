import type { AuthResponse } from '@/types/Auth';

export const requestForLog = async (): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: 'Successfully logged in',
    status: 200,
    timestamp: new Date().toISOString()
  };
};
