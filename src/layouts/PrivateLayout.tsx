import { Profiler, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useUser } from '@clerk/clerk-react';

import { AppInitialLoading } from '@/components/loader';
import { onRender } from '@/utils/profiler';

import AppTopBar from '@/layouts/AppTopBar';
import Footer from '@/layouts/Footer';

const PrivateLayout = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <AppInitialLoading />;

  if (!isSignedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* top bar */}
      <Profiler id="AppTopBar" onRender={onRender}>
        <AppTopBar />
      </Profiler>

      <main className="grow p-4">
        {/* child routes render here */}
        <Suspense fallback={<AppInitialLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default PrivateLayout;
