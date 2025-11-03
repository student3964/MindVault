// frontend/src/components/Navbar.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { useAuth } from '../context/AuthContext';
import '../pages/uploadNotes.css';

interface NavbarProps {
  activePage: 'home' | 'explore' | 'workspace' | 'about';
  isLoggedIn?: boolean;
  onWorkspaceClick?: () => void;
  onNavClick?: (page: 'home' | 'explore' | 'workspace' | 'about') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activePage,
  isLoggedIn = false,
  onWorkspaceClick,
  onNavClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleScrollTo = (section: string) => {
    scroller.scrollTo(section, {
      smooth: true,
      duration: 600,
      offset: -64,
    });
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavClick) onNavClick('home');
    if (location.pathname === '/') handleScrollTo('home');
    else navigate('/');
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavClick) onNavClick('explore');
    if (location.pathname === '/') handleScrollTo('explore');
    else navigate('/?scroll=explore');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') handleScrollTo('home');
    else navigate('/');
  };

  const handleLoginClick = () => navigate('/login');
  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md z-50 shadow-lg h-16 flex items-center justify-between px-8 md:px-16"
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // sleek translucent line
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 ml-8">
        <a
          href="/"
          onClick={handleLogoClick}
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '700',
            fontSize: '1.5rem',
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          MindVault
        </a>
      </div>

      {/* Middle: Navigation Links */}
      <div className="flex items-center space-x-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {[
          { name: 'Home', page: 'home', action: handleHomeClick },
          { name: 'Explore', page: 'explore', action: handleExploreClick },
          { name: 'Workspace', page: 'workspace', action: onWorkspaceClick ? onWorkspaceClick : () => navigate('/workspace') },
          { name: 'About', page: 'about', action: () => navigate('/about') },
        ].map(({ name, page, action }) => {
          const isActive = activePage === page;

          return (
            <span
              key={page}
              onClick={action}
              className="relative group cursor-pointer"
              style={{
                color: isActive ? '#a855f7' : 'white',
                fontWeight: '400', // fully normal text (not bold)
                fontSize: '1rem',
                paddingBottom: '4px',
                borderBottom: isActive ? '2px solid #a855f7' : '2px solid transparent',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
            >
              {/* Text that turns purple on hover */}
              <span
                className="transition-colors duration-300"
                style={{
                  transition: 'color 0.3s ease',
                }}
              >
                {name}
              </span>

              {/* Animated underline for inactive tabs */}
              {!isActive && (
                <span
                  className="absolute left-0 bottom-0 h-[2px] bg-purple-500 transition-all duration-400 ease-in-out"
                  style={{
                    width: '0',
                    transition: 'width 0.4s ease-in-out',
                  }}
                ></span>
              )}

              {/* Hover effect handled with JS for full visibility */}
              <style>{`
                .group:hover {
                  color: #a855f7 !important;
                }
                .group:hover span.absolute {
                  width: 100% !important;
                }
              `}</style>
            </span>
          );
        })}
      </div>

      {/* Right: Login/Logout Buttons */}
      <div className="flex items-center space-x-3 mr-8">
        {isLoggedIn ? (
          <button
            className="login-glow-btn font-poppins text-[0.95rem] px-4 py-1"
            style={{ fontWeight: 500 }}
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        ) : (
          <button
            className="login-glow-btn font-poppins text-[0.95rem] px-4 py-1"
            style={{ fontWeight: 500 }}
            onClick={handleLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
