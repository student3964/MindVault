// frontend/src/components/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // We will use your footer component
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Get login state from context
  const location = useLocation();

  // This function determines which nav link should be active
  const getActivePage = () => {
    const { pathname } = location;
    if (pathname.startsWith('/workspace')) return 'workspace';
    if (pathname === '/about') return 'about';
    // Add other pages if needed
    return 'home'; // Default
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#11081a]">
      <Navbar activePage={getActivePage()} isLoggedIn={isLoggedIn} />
      
      {/* Outlet is a placeholder where your page (Home, About, etc.) will be rendered */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;