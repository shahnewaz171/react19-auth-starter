import { createBrowserRouter } from 'react-router';

import lazyRoutes from '@/lib/router/lazy-routes';

// core
import AppErrorFallback from '@/lib/error-boundary';
import PrivateLayout from '@/layouts/PrivateLayout';
import PublicLayout from '@/layouts/PublicLayout';

// pages
const { Login, Register, Home, NotFound } = lazyRoutes;

const router = createBrowserRouter([
  {
    ErrorBoundary: AppErrorFallback,
    children: [
      {
        Component: PrivateLayout,
        children: [
          { index: true, Component: Home },
          { path: '*', Component: NotFound }
        ]
      },
      {
        Component: PublicLayout,
        children: [
          { path: 'login', Component: Login },
          { path: 'register', Component: Register },
          { path: '*', Component: NotFound }
        ]
      }
    ]
  }
]);

export default router;
