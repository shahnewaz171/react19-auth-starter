import { createBrowserRouter } from 'react-router';
import lazyRoutes from '@/lib/router/lazy-routes';

// core
import PrivateLayout from '@/layouts/PrivateLayout';
import PublicLayout from '@/layouts/PublicLayout';
import ErrorBoundary from '@/components/core/ErrorBoundary';

// pages
const { Login, Register, Home, NotFound } = lazyRoutes;

const router = createBrowserRouter([
  {
    Component: PrivateLayout,
    ErrorBoundary,
    children: [
      {
        index: true,
        Component: Home
      },
      { path: '*', Component: NotFound }
    ]
  },
  {
    Component: PublicLayout,
    ErrorBoundary,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: '*', Component: NotFound }
    ]
  }
]);

export default router;
