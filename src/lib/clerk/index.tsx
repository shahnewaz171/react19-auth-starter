import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { VITE_CLERK_PUBLISHABLE_KEY } from '@/utils/env';

type Props = { children: ReactNode };

const ClerkAuthProvider = ({ children }: Props) => {
  if (!VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file');
  }

  return <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY}>{children}</ClerkProvider>;
};

export default ClerkAuthProvider;
