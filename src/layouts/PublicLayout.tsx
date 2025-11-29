import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useUser } from '@clerk/clerk-react';

import { AppInitialLoading } from '@/components/loader';

import Footer from '@/layouts/Footer';
import Navbar from '@/layouts/Navbar';

const PublicLayout = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <AppInitialLoading />;

  if (isSignedIn) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* navbar */}
      <Navbar />

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

export default PublicLayout;
