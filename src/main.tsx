import { StrictMode, Suspense } from 'react';

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';

// router
import router from '@/lib/router';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
