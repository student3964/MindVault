// frontend/src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Ensure Footer is imported
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [activePage, setActivePage] = useState<'home' | 'explore' | 'workspace' | 'about'>('home');

  // This effect synchronizes the active nav link with the current URL path
  useEffect(() => {
    const { pathname } = location;
    if (pathname.startsWith('/workspace')) {
      setActivePage('workspace');
    } else if (pathname === '/about') {
      setActivePage('about');
    } else if (pathname === '/') {
      // When navigating to the home page, default to 'home' active.
      // Clicks on 'Home' or 'Explore' will override this via the onNavClick callback.
      setActivePage('home');
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-[#11081a]">
      <Navbar
        activePage={activePage}
        isLoggedIn={isLoggedIn}
        onNavClick={setActivePage} // Pass the setter function to Navbar
      />
      
      {/* Outlet is a placeholder where your page (Home, About, etc.) content is rendered */}
      <div className="flex-grow">
        <Outlet />
      </div>
      
      {/* 1. ADDED: Footer component is now rendered on all pages wrapped by Layout */}
      <Footer />
    </div>
  );
};

export default Layout;