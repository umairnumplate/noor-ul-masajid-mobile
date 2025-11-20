import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, AcademicCapIcon, ClipboardCheckIcon, StatusOnlineIcon, GraduationCapIcon, BuildingLibraryIcon, CashIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navLinkClasses = 'flex items-center px-4 py-3 text-teal-100 hover:bg-primary-darker/50 rounded-lg transition-colors duration-200';
  const activeNavLinkClasses = 'bg-primary-darker/60 shadow-inner text-white font-semibold';

  const sidebarContent = (
    <>
      <div className="flex items-center justify-center h-20 border-b border-primary-dark/50">
        <StatusOnlineIcon className="h-10 w-10 text-secondary" />
        <h1 className="text-xl font-bold ml-2 text-white">Noor ul Masajid</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)} end>
          <HomeIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <UserGroupIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Students</span>
        </NavLink>
        <NavLink to="/teachers" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <AcademicCapIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Teachers</span>
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <ClipboardCheckIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Attendance</span>
        </NavLink>
        <NavLink to="/graduates" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <GraduationCapIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Graduates</span>
        </NavLink>
        <NavLink to="/tanzim" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <BuildingLibraryIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Tanzim-ul-Madaris</span>
        </NavLink>
        <NavLink to="/madrasa-fees" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>
          <CashIcon className="h-6 w-6 mr-3 text-secondary" />
          <span>Madrasa Fees</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-primary-dark/50 text-center text-xs text-teal-200">
        <p>&copy; {new Date().getFullYear()} Noor ul Masajid</p>
        <p>Version 1.1.0</p>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-dark to-primary-darker text-white flex-flex-col shadow-2xl z-30 transform transition-transform md:relative md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
