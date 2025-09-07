import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  activePage: 'home' | 'explore' | 'workspace' | 'about';
  isLoggedIn?: boolean;
  onWorkspaceClick?: () => void; // New optional prop
}

const Navbar: React.FC<NavbarProps> = ({ activePage, isLoggedIn = false, onWorkspaceClick }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');
  const handleGetStartedClick = () => navigate('/signup');
  const handleLogoutClick = () => {
    // In a real app, you would clear auth context/storage here
    window.location.href = '/'; // Go to homepage and reload to clear state
  };

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
          
          {/* This Workspace link is now smarter */}
          <a
            onClick={onWorkspaceClick ? onWorkspaceClick : () => navigate('/workspace')}
            className={`nav-link cursor-pointer ${activePage === 'workspace' ? 'active' : ''}`}
          >
            Workspace
          </a>

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