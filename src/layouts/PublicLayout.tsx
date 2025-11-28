import { Outlet } from 'react-router';

import Footer from '@/layouts/Footer';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">React 19 Boilerplate</h1>
      </div>
    </header>

    <main className="flex-grow container mx-auto p-4">
      {/* child routes render here */}
      <Outlet />
    </main>

    <Footer />
  </div>
);

export default PublicLayout;
