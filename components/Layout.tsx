import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../contexts/AppContext';
import { MenuIcon } from './Icons';

const Layout: React.FC = () => {
  const { isOnline } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-transparent font-sans text-on-surface">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-surface shadow-md z-10">
            <button 
              className="md:hidden text-on-surface-light hover:text-on-surface"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                {isOnline ? 'Online' : 'Offline'}
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;