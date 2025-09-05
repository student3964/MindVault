import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  activePage: 'home' | 'explore' | 'workspace' | 'about';
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, isLoggedIn = false }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');
  const handleGetStartedClick = () => navigate('/signup');
  const handleLogoutClick = () => navigate('/');

  return (
    <nav className="nav-bar fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
        <RouterLink to="/" className="nav-logo cursor-pointer transition whitespace-nowrap">
          MindVault
        </RouterLink>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <RouterLink
            to="/"
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          >
            Home
          </RouterLink>
          <RouterLink
            to="/#explore"
            className={`nav-link ${activePage === 'explore' ? 'active' : ''}`}
          >
            Explore
          </RouterLink>
          <RouterLink
            to="/workspace"
            className={`nav-link ${activePage === 'workspace' ? 'active' : ''}`}
          >
            Workspace
          </RouterLink>
          <RouterLink
            to="/about"
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
          >
            About
          </RouterLink>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button className="glow-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          ) : (
            <>
              <button className="glow-btn" onClick={handleLoginClick}>
                Login
              </button>
              <button className="primary-btn" onClick={handleGetStartedClick}>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
