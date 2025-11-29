/**
 * Custom hook to check if user has specific role
 */

import { useUser } from '@clerk/clerk-react';
import type { Roles } from '@/types/globals';

export function useRole() {
  const { user } = useUser();
  const { publicMetadata } = user || {};

  const hasRole = (role: Roles) => publicMetadata?.role === role;

  const isAdmin = () => hasRole('admin');
  const isUser = () => hasRole('user');

  return {
    role: publicMetadata?.role ?? null,
    hasRole,
    isAdmin,
    isUser
  };
}
