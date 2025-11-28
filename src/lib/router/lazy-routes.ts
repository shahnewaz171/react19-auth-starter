import { lazy } from 'react';

const lazyRoutes = {
  Login: lazy(() => import('@/pages/Login')),
  Register: lazy(() => import('@/pages/Register')),
  Home: lazy(() => import('@/pages/Home')),
  NotFound: lazy(() => import('@/pages/NotFound'))
};

export default lazyRoutes;
