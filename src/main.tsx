import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import './index.css';

import AppErrorFallback from '@/lib/error-boundary';
import ClerkAuthProvider from '@/lib/clerk';
import router from '@/lib/router';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={AppErrorFallback}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />

        <Toaster richColors position="top-center" />

        <ClerkAuthProvider>
          <RouterProvider router={router} />
        </ClerkAuthProvider>
      </StyledEngineProvider>
    </ErrorBoundary>
  </StrictMode>
);
