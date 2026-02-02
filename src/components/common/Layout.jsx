import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
